// BookRoom.tsx
import BookingForCard from "@/components/ui/bookingscreens/BookingForCard";
import BookingFormCard from "@/components/ui/bookingscreens/BookingFormCard";
import DateDeatil from "@/components/ui/bookingscreens/DateDeaatil";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";

// Firebase
import { auth, db } from "@/constants/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// --- helpers for dd/MM/yyyy ---
const parseDMY = (s?: string | null) => {
  if (!s) return null;
  const parts = s.split(/[\/-]/).map((x) => parseInt(x, 10));
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy) return null;
  const t = Date.UTC(yyyy, mm - 1, dd);
  return Number.isNaN(t) ? null : t;
};
const diffDaysDMY = (checkIn?: string, checkOut?: string) => {
  const t1 = parseDMY(checkIn);
  const t2 = parseDMY(checkOut);
  if (t1 == null || t2 == null) return 0;
  const ms = t2 - t1;
  const days = Math.ceil(ms / 86_400_000);
  return days > 0 ? days : 0;
};

const BookRoom = () => {
  const params = useLocalSearchParams();
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // UI data
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [dayCount, setDayCount] = useState<number>(0);

  const [url, setUrl] = useState<string>("");
  const [hotelTitle, setHotelTitle] = useState<string>("");
  const [province, setProvince] = useState<string>(""); // hotel_location
  const [roomDetail, setRoomDetail] = useState<string>("");
  const [address, setAddress] = useState<string>("");   // using hotel_location as address (no separate field)

  const [userFName, setUserFName] = useState<string>("");
  const [userLName, setUserLName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // load everything by roomId
  useEffect(() => {
    (async () => {
      try {
        if (!roomId) {
          setErr("Missing roomId");
          return;
        }

        // 1) room
        const rRef = doc(db, "rooms", roomId);
        const rSnap = await getDoc(rRef);
        if (!rSnap.exists()) {
          setErr("Room not found");
          return;
        }
        const r = rSnap.data() as any;

        // dates (stored as dd/MM/yyyy)
        const inStr: string = r.room_date_checkIn || "";
        const outStr: string = r.room_date_checkOut || "";
        setCheckInDate(inStr);
        setCheckOutDate(outStr);
        setDayCount(diffDaysDMY(inStr, outStr));

        setRoomDetail(r.room_description || "");
        setHotelTitle(r.hotel_name || ""); // you denormalize hotel_name onto room
        const roomPhoto = r.room_photoURL || ""; // HTTPS now
        setUrl(roomPhoto);

        // 2) hotel (for location & fallback image)
        if (r.hotel_id) {
          const hRef = doc(db, "hotels", r.hotel_id);
          const hSnap = await getDoc(hRef);
          if (hSnap.exists()) {
            const h = hSnap.data() as any;
            const loc = h.hotel_location || "";
            setProvince(loc);
            setAddress(loc);
            // fallback image if room has none
            if (!roomPhoto) setUrl(h.hotel_photoURL || "");
            // fallback title if needed
            if (!r.hotel_name) setHotelTitle(h.hotel_name || "");
          }
        }

        // 3) user profile (current buyer) — prefill, read-only
        const user = auth.currentUser;
        if (user) {
          setEmail(user.email ?? "");
          const pRef = doc(db, "profile", user.uid);
          const pSnap = await getDoc(pRef);
          if (pSnap.exists()) {
            const p = pSnap.data() as any;
            setUserFName(p.fname ?? "");
            setUserLName(p.lname ?? "");
            setPhoneNumber(p.telephone_number ?? "");
          }
        }
      } catch (e) {
        console.error("Load booking data failed:", e);
        setErr("Failed to load booking data");
      } finally {
        setLoading(false);
      }
    })();
  }, [roomId]);

  const country = "ไทย"; // fixed per your request

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: 40 }]}>
        <ActivityIndicator />
      </View>
    );
  }
  if (err) {
    Alert.alert("Error", err);
    return <View style={styles.container} />;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <DateDeatil checkInDate={checkInDate} checkOutDate={checkOutDate} dayCount={dayCount} />
        <BookingForCard
          url={url}
          hotelTitle={hotelTitle}
          province={province}
          roomDetail={roomDetail}
          address={address}
        />
        <BookingFormCard
          fname={userFName}
          lname={userLName}
          email={email}
          phone_number={phoneNumber}
          // show country fixed inside the form
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
});

export default BookRoom;
