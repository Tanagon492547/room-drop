// RoomForm.tsx
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";
import { ensureUploaded } from '../../../src/lib/uploadImage';

// Firebase
import { auth, db } from "@/constants/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

// Image Picker
import * as ImagePicker from "expo-image-picker";

const RoomForm = () => {
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();

  const isEdit = !!roomId;

  const [hotel_name, setHotelName] = useState("");
  const [hotel_location, setHotelLocation] = useState("");
  const [hotel_photoURL, setHotelPhoto] = useState("");
  const [room_name, setRoomName] = useState("");
  const [room_date_checkIn, setCheckIn] = useState("");
  const [room_date_checkOut, setCheckOut] = useState("");
  const [room_price, setRoomPrice] = useState("");
  const [room_description, setRoomDescription] = useState("");
  const [room_photoURL, setRoomPhoto] = useState("");
  const [room_bill, setRoomBill] = useState("");
  const [promptPay, setPromptPay] = useState("");
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const room_status = 1;

  const resetForm = useCallback(() => {
    setHotelName("");
    setHotelLocation("");
    setHotelPhoto("");
    setRoomName("");
    setCheckIn("");
    setCheckOut("");
    setRoomPrice("");
    setRoomDescription("");
    setRoomPhoto("");
    setRoomBill("");
    setHotelId(null);
    // keep promptPay (loaded from profile) as-is
  }, []);

  // Load PromptPay + existing room (if editing)
  useEffect(() => {
    (async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const ref = doc(db, "profile", user.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            setPromptPay((data as any).promptPay || "");
          }
        }

        if (isEdit && typeof roomId === "string") {
          // Load room
          const rRef = doc(db, "rooms", roomId);
          const rSnap = await getDoc(rRef);
          if (rSnap.exists()) {
            const r = rSnap.data() as any;
            setRoomName(r.room_name || "");
            setRoomDescription(r.room_description || "");
            setRoomPrice(String(r.room_price ?? ""));
            setCheckIn(r.room_date_checkIn || "");
            setCheckOut(r.room_date_checkOut || "");
            setRoomPhoto(r.room_photoURL || "");
            setRoomBill(r.room_bill || "");
            setHotelId(r.hotel_id ?? null);
            setHotelName(r.hotel_name || "");

            // Load hotel
            if (r.hotel_id) {
              const hRef = doc(db, "hotels", r.hotel_id);
              const hSnap = await getDoc(hRef);
              if (hSnap.exists()) {
                const h = hSnap.data() as any;
                setHotelLocation(h.hotel_location || "");
                setHotelPhoto(h.hotel_photoURL || "");
              }
            } else {
              setHotelLocation(r.hotel_location || "");
              setHotelPhoto(r.hotel_photoURL || "");
            }
          } else {
            Alert.alert("Not found", "Room does not exist.");
            router.back();
          }
        } else {
          resetForm();
        }
      } catch (e) {
        console.error("Load failed:", e);
        Alert.alert("Error", "Failed to load data.");
      }
    })();
  }, [isEdit, roomId]);

  // Pick image helper
  const pickImage = async (setImage: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to gallery.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const sendForm = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      setSubmitting(true);

      if (isEdit && typeof roomId === "string") {
        // -------- EDIT MODE --------
        // Upload only if local file://
        const httpsHotelPhoto = await ensureUploaded(
          hotel_photoURL,
          () => `hotels/${hotelId ?? 'unknown'}/cover.jpg`
        );
        const httpsRoomPhoto = await ensureUploaded(
          room_photoURL,
          () => `rooms/${roomId}/room.jpg`
        );
        const httpsRoomBill = await ensureUploaded(
          room_bill,
          () => `rooms/${roomId}/bill.jpg`
        );

        // Update local state so UI previews switch to HTTPS
        if (httpsHotelPhoto) setHotelPhoto(httpsHotelPhoto);
        if (httpsRoomPhoto) setRoomPhoto(httpsRoomPhoto);
        if (httpsRoomBill) setRoomBill(httpsRoomBill);

        // Update hotel (if known)
        if (hotelId) {
          await updateDoc(doc(db, "hotels", hotelId), {
            hotel_name,
            hotel_location,
            hotel_photoURL: httpsHotelPhoto ?? hotel_photoURL ?? null,
            updatedAt: serverTimestamp(),
          });
        }

        // Update room
        await updateDoc(doc(db, "rooms", roomId), {
          room_name,
          room_description,
          room_price: Number(room_price ?? 0),
          room_date_checkIn,
          room_date_checkOut,
          room_photoURL: httpsRoomPhoto ?? room_photoURL ?? null,
          room_bill: httpsRoomBill ?? room_bill ?? null,
          hotel_name,
          updatedAt: serverTimestamp(),
        });

        Alert.alert("Success", "Room updated.");
      } else {
        // -------- ADD MODE --------
        // 1) Create hotel & room docs first to get IDs
        const hotelRef = await addDoc(collection(db, "hotels"), {
          hotel_name,
          hotel_location,
          hotel_photoURL: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const roomRef = await addDoc(collection(db, "rooms"), {
          room_name,
          room_description,
          room_price: Number(room_price ?? 0),
          room_date_checkIn,
          room_date_checkOut,
          room_photoURL: null,
          room_bill: null,
          room_status,
          hotel_id: hotelRef.id,
          hotel_name,
          user_id: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // 2) Upload images to stable paths
        const httpsHotelPhoto = await ensureUploaded(
          hotel_photoURL,
          () => `hotels/${hotelRef.id}/cover.jpg`
        );
        const httpsRoomPhoto = await ensureUploaded(
          room_photoURL,
          () => `rooms/${roomRef.id}/room.jpg`
        );
        const httpsRoomBill = await ensureUploaded(
          room_bill,
          () => `rooms/${roomRef.id}/bill.jpg`
        );

        // Update local state so UI previews switch to HTTPS (if you stay on the page)
        if (httpsHotelPhoto) setHotelPhoto(httpsHotelPhoto);
        if (httpsRoomPhoto) setRoomPhoto(httpsRoomPhoto);
        if (httpsRoomBill) setRoomBill(httpsRoomBill);

        // 3) Patch docs with the HTTPS URLs
        await Promise.all([
          updateDoc(hotelRef, {
            hotel_photoURL: httpsHotelPhoto ?? null,
            updatedAt: serverTimestamp(),
          }),
          updateDoc(roomRef, {
            room_photoURL: httpsRoomPhoto ?? null,
            room_bill: httpsRoomBill ?? null,
            updatedAt: serverTimestamp(),
          }),
        ]);

        Alert.alert("Success", "Room posted.");
      }

      router.replace("/(app)/(tabs)/dropping");
    } catch (error: any) {
      console.error("Submit failed:", { code: error?.code, message: error?.message, name: error?.name });
      Alert.alert("Error", error?.message ?? "Failed to submit room.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <View style={styles.form}>
      <ScrollView>
        <View style={styles.formIn}>
          <Text style={styles.h1}>{isEdit ? "Edit Room" : "Post a Room"}</Text>

          <View style={styles.inputArea}>
            <Text>Hotel Name</Text>
            <TextInput
              placeholder="Hotel Name"
              style={styles.input}
              value={hotel_name}
              onChangeText={setHotelName}
            />
          </View>

          <View style={styles.inputArea}>
            <Text>Hotel Location</Text>
            <TextInput
              placeholder="Hotel Location"
              style={styles.input}
              value={hotel_location}
              onChangeText={setHotelLocation}
            />
          </View>

          {/* Hotel Photo */}
          <View style={styles.inputArea}>
            <Button icon="upload" mode="outlined" onPress={() => pickImage(setHotelPhoto)}>
              {hotel_photoURL ? "Change Hotel Photo" : "Upload Hotel Photo"}
            </Button>
          </View>

          <View style={styles.inputArea}>
            <Text>Room Name</Text>
            <TextInput
              placeholder="Room Name"
              style={styles.input}
              value={room_name}
              onChangeText={setRoomName}
            />
          </View>

          <View style={styles.dateinputArea}>
            <View>
              <Text>Check-in Date</Text>
              <TextInput
                style={styles.inputDate}
                placeholder="22/09/2025"
                value={room_date_checkIn}
                onChangeText={setCheckIn}
              />
            </View>
            <View>
              <Text>Check-out Date</Text>
              <TextInput
                style={styles.inputDate}
                placeholder="25/09/2025"
                value={room_date_checkOut}
                onChangeText={setCheckOut}
              />
            </View>
          </View>

          <View style={styles.inputArea}>
            <Text>Room Price</Text>
            <TextInput
              placeholder="Room Price"
              style={styles.input}
              value={room_price}
              onChangeText={setRoomPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputArea}>
            <Text>Room Description</Text>
            <TextInput
              placeholder="Room Description"
              style={styles.input}
              value={room_description}
              onChangeText={setRoomDescription}
            />
          </View>

          {/* Room Photo */}
          <View style={styles.inputArea}>
            <Button icon="upload" mode="outlined" onPress={() => pickImage(setRoomPhoto)}>
              {room_photoURL ? "Change Room Photo" : "Upload Room Photo"}
            </Button>
          </View>

          {/* Room Bill */}
          <View style={styles.inputArea}>
            <Button icon="paperclip" mode="outlined" onPress={() => pickImage(setRoomBill)}>
              {room_bill ? "Change Booking Evidence" : "Upload Booking Evidence"}
            </Button>
          </View>

          {/* PromptPay (read-only) */}
          <View style={styles.inputArea}>
            <Text style={{ color: "red" }}>*PromptPay Number</Text>
            <TextInput style={styles.input} value={promptPay} editable={false} />
          </View>

          <View style={styles.inputArea}>
            <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
              <Button
                mode="contained"
                buttonColor="#1C5CB7"
                style={{ width: 200, borderRadius: 5, opacity: submitting ? 0.7 : 1 }}
                onPress={sendForm}
                disabled={submitting}
              >
                {isEdit ? "Update" : "Submit"}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  form: { width: 359, padding: 10, height: 580, paddingBottom: 20 },
  formIn: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 17,
    paddingHorizontal: 20,
    gap: 10,
    paddingVertical: 20,
  },
  input: {
    borderColor: "#9d9d9db3",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputArea: { gap: 10, marginHorizontal: 10 },
  button: { width: 150 },
  dateinputArea: {
    gap: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputDate: {
    borderColor: "#9d9d9db3",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 12,
    width: 140,
  },
  h1: { fontSize: 20, fontWeight: "800" },
});

export default RoomForm;
