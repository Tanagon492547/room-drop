import ButtonGroup from "@/components/ui/homes/ButtonGroup";
import HotelDDetailCard from "@/components/ui/hoteldetails/HotelDDetailCard";
import RoomDetailCard from "@/components/ui/roomdetails/RoomDetailCard";
import TitleText from "@/components/ui/TitleText";
import { colors } from "@/constants/Colors";
import { db } from "@/constants/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

const FALLBACK =
  "https://as1.ftcdn.net/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg";

const isHttp = (u?: string) => !!u && (u.startsWith("http://") || u.startsWith("https://"));
const isGs = (u?: string) => !!u && u.startsWith("gs://");
const isFile = (u?: string) => !!u && u.startsWith("file://");

// A. Show something now (accept http/https, gs -> getDownloadURL, file:// passthrough so YOUR device can render immediately)
const resolveUrlForDisplay = async (raw?: string) => {
  try {
    if (!raw) return FALLBACK;
    if (isHttp(raw)) return raw;
    const storage = getStorage();
    if (isGs(raw)) return await getDownloadURL(ref(storage, raw));
    if (isFile(raw)) return raw; // works on the original device only
    return FALLBACK;
  } catch (e) {
    console.log("resolveUrlForDisplay error:", raw, e);
    return FALLBACK;
  }
};

// B. Permanent fix: if file://, upload to Storage and return HTTPS
const uploadIfLocalAndGetHttps = async (raw?: string, destPath?: string) => {
  try {
    if (!raw || !isFile(raw) || !destPath) return undefined;
    const storage = getStorage();
    const r = ref(storage, destPath);
    const resp = await fetch(raw);
    const blob = await resp.blob();
    await uploadBytes(r, blob);
    const https = await getDownloadURL(r);
    return https;
  } catch (e) {
    console.log("uploadIfLocalAndGetHttps error:", raw, destPath, e);
    return undefined;
  }
};

const RoomDetail = () => {
  // --- 1) get roomId + optional hotel name from URL ---
  const params = useLocalSearchParams();
  const roomId = useMemo(
    () => (Array.isArray(params.roomId) ? params.roomId[0] : params.roomId),
    [params.roomId]
  );
  const hotelTitleFromParam = useMemo(
    () => (Array.isArray(params.nameHotel) ? params.nameHotel[0] : params.nameHotel) ?? "",
    [params.nameHotel]
  );

  // DEBUG: log roomId every time page opens
  useEffect(() => {
    console.log("[RoomDetail] opened with roomId =", roomId);
  }, [roomId]);

  // --- 2) state for real data ---
  const [loading, setLoading] = useState(true);

  // hotel card states
  const [hotelPhotoUrl, setHotelPhotoUrl] = useState<string>(FALLBACK);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [hotelTitle, setHotelTitle] = useState<string | undefined>(hotelTitleFromParam);
  const [hotelDetail, setHotelDetail] = useState<string | undefined>(undefined);

  // room card states
  const [roomPhotoUrl, setRoomPhotoUrl] = useState<string>(FALLBACK);
  const [roomStatus, setRoomStatus] = useState<boolean>(true);
  const [roomDetail, setRoomDetail] = useState<string | undefined>(undefined);
  const [bedType, setBedType] = useState<string | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      if (!roomId) {
        setLoading(false);
        Alert.alert("Error", "Missing room id.");
        return;
      }
      try {
        console.log("[RoomDetail] fetching room doc:", roomId);

        // 1) room
        const roomRef = doc(db, "rooms", roomId);
        const roomSnap = await getDoc(roomRef);
        if (!roomSnap.exists()) {
          setLoading(false);
          Alert.alert("Not found", "This room does not exist.");
          console.log("[RoomDetail] room not found:", roomId);
          return;
        }
        const room = roomSnap.data() as any;
        console.log("[RoomDetail] room data:", room);

        // 2) hotel
        let hotel: any = null;
        let hotelRef;
        if (room.hotel_id) {
          console.log("[RoomDetail] fetching hotel doc:", room.hotel_id);
          hotelRef = doc(db, "hotels", room.hotel_id);
          const hotelSnap = await getDoc(hotelRef);
          hotel = hotelSnap.exists() ? hotelSnap.data() : null;
          console.log("[RoomDetail] hotel data:", hotel);
        }

        // 3) Show images right now (even if file://)
        const displayHotel = await resolveUrlForDisplay(hotel?.hotel_photoURL);
        const displayRoom = await resolveUrlForDisplay(room?.room_photoURL);
        setHotelPhotoUrl(displayHotel);
        setRoomPhotoUrl(displayRoom);
        {/*console.log("[RoomDetail] display hotel photo:", displayHotel);
        console.log("[RoomDetail] display room photo:", displayRoom);*/}

        // 4) If file://, upload to Storage now and persist HTTPS back to Firestore (one-time repair)
        //    After upload, set state again so the new HTTPS appears immediately.
        if (isFile(hotel?.hotel_photoURL) && hotelRef) {
          const https = await uploadIfLocalAndGetHttps(hotel.hotel_photoURL, `hotels/${room.hotel_id}.jpg`);
          if (https) {
            await updateDoc(hotelRef, { hotel_photoURL: https });
            setHotelPhotoUrl(https);
            {/*console.log("[RoomDetail] repaired hotel photo to:", https);*/}
          }
        }

        if (isFile(room?.room_photoURL)) {
          const https = await uploadIfLocalAndGetHttps(room.room_photoURL, `rooms/${roomId}.jpg`);
          if (https) {
            await updateDoc(roomRef, { room_photoURL: https });
            setRoomPhotoUrl(https);
            {/*console.log("[RoomDetail] repaired room photo to:", https);*/}
          }
        }

        // 5) map fields
        const pickedTitle = room.hotel_name || hotel?.hotel_name || hotelTitleFromParam || "Unknown Hotel";
        const pickedAddress = hotel?.hotel_location || room.hotel_location || "-";
        const pickedHotelDetail = hotel?.hotel_detail || "";
        const pickedRoomDetail = room.room_description || "";
        const pickedBedType = room.bed_type || undefined;

        setHotelTitle(pickedTitle);
        setAddress(pickedAddress);
        setHotelDetail(pickedHotelDetail);
        setRoomDetail(pickedRoomDetail);
        setBedType(pickedBedType);
        setRoomStatus(true); // or derive from room.is_available

      } catch (e: any) {
        console.error("Room detail load error:", e);
        Alert.alert("Error", e.message ?? "Unable to load room.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [roomId, hotelTitleFromParam]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TitleText hotelTitle={hotelTitle} />

      <ScrollView style={[styles.card, styles.shadow]}>
        {/* HOTEL IMAGE (hotelPhotoUrl) */}
        <HotelDDetailCard
          url={hotelPhotoUrl}
          hotelTitle={hotelTitle}
          address={address}
          hotelDetail={hotelDetail}
        />

        <View style={styles.roomStatus}>
          <Text style={styles.h1}>{roomStatus ? "ห้องว่าง" : "ห้องไม่ว่าง"}</Text>
        </View>

        {/* ROOM IMAGE (roomPhotoUrl) */}
        <RoomDetailCard roomDetail={roomDetail} bedType={bedType} url={roomPhotoUrl} />
      </ScrollView>

      <View style={styles.fileBox}>
        <ButtonGroup roomId={roomId ?? ""} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  fileBox: {
    paddingVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  card: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 20,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
      },
      android: { elevation: 4 },
    }),
  },
  roomStatus: {
    width: "100%",
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  h1: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textBlue,
  },
});

export default RoomDetail;


