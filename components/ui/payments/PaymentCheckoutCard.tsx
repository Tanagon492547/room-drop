// components/ui/payments/PaymentCheckoutCard.tsx
import { colors } from "@/constants/Colors";
import { auth, db } from "@/constants/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Image, Platform, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { ensureUploaded } from "../../../src/lib/uploadImage";

type Props = {
  roomId: string;
};

const PaymentCheckoutCard = ({ roomId }: Props) => {
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const [promptPay, setPromptPay] = useState<string>(""); // seller's PromptPay
  const [billUri, setBillUri] = useState<string>("");     // local file:// or https (after upload preview)

  // optional: show hotel/room name (nice UX, not required)
  const [hotelName, setHotelName] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");

  const canPay = useMemo(() => !!roomId && !!billUri && !posting, [roomId, billUri, posting]);

  useEffect(() => {
    (async () => {
      try {
        if (!roomId) {
          Alert.alert("Error", "Missing roomId");
          return;
        }
        // 1) load room
        const rRef = doc(db, "rooms", roomId);
        const rSnap = await getDoc(rRef);
        if (!rSnap.exists()) {
          Alert.alert("Error", "Room not found");
          return;
        }
        const r = rSnap.data() as any;
        setHotelName(r.hotel_name ?? "");
        setRoomName(r.room_name ?? "");

        // 2) load seller profile for PromptPay
        const sellerId: string | undefined = r.user_id || r.users_id; // normalize if needed
        if (sellerId) {
          const pRef = doc(db, "profile", sellerId);
          const pSnap = await getDoc(pRef);
          if (pSnap.exists()) {
            const p = pSnap.data() as any;
            setPromptPay(p.promptPay ?? p.promtpay ?? ""); // handle typo variations
          }
        }
      } catch (e) {
        console.error("Payment init error:", e);
        Alert.alert("Error", "Failed to load payment data");
      } finally {
        setLoading(false);
      }
    })();
  }, [roomId]);

  const pickBill = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission", "Please allow access to your photos.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) {
        setBillUri(result.assets[0].uri);
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Could not open gallery");
    }
  };

  const submitPayment = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Sign in required", "Please sign in to continue.");
        return;
      }
      if (!roomId) {
        Alert.alert("Error", "Missing room ID");
        return;
      }
      if (!billUri) {
        Alert.alert("Missing image", "Please attach your payment slip.");
        return;
      }

      setPosting(true);

      // 1) create booking doc (pending)
      const bookingsRef = collection(db, "bookings");
      const bookingRef = await addDoc(bookingsRef, {
        room_id: roomId,
        user_id: user.uid,
        booking_bill: null,          // will fill after upload
        booking_status: 0,           // 0 = waiting for seller to approve
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 2) upload bill to Storage and update
      const httpsBill = await ensureUploaded(billUri, () => `bookings/${bookingRef.id}/bill.jpg`);
      // switch local preview to https (optional)
      if (httpsBill) setBillUri(httpsBill);

      await updateDoc(bookingRef, {
        booking_id: bookingRef.id,
        booking_bill: httpsBill ?? null,
        updatedAt: serverTimestamp(),
      });

      Alert.alert("Success", "Payment submitted. Waiting for seller approval.");
      router.replace("/"); // or navigate to your “My bookings” page when ready
    } catch (e: any) {
      console.error("Submit payment failed:", { code: e?.code, message: e?.message });
      Alert.alert("Error", e?.message ?? "Failed to submit payment");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.card, styles.shadow, { alignItems: "center", justifyContent: "center" }]}>
        <Text>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.shadow]}>
      {(hotelName || roomName) ? (
        <Text style={styles.title}>
          {hotelName}{hotelName && roomName ? " · " : ""}{roomName}
        </Text>
      ) : null}

      {/* PromptPay: read-only */}
      <Text style={styles.label}>PromptPay (seller)</Text>
      <TextInput
        mode="outlined"
        value={promptPay || "-"}
        editable={false}
        outlineStyle={{ borderRadius: 12, borderColor: colors.borderColor, backgroundColor: colors.background }}
      />

      {/* Bill picker + preview */}
      <View style={{ gap: 8 }}>
        <Text style={styles.label}>Upload payment slip</Text>
        <Button mode="outlined" icon="upload" onPress={pickBill} disabled={posting}>
          {billUri ? "Change Image" : "Select Image"}
        </Button>
        {billUri ? (
          <Image
            source={{ uri: billUri }}
            style={{ width: "100%", height: 180, borderRadius: 8, marginTop: 8, backgroundColor: "#eee" }}
            resizeMode="cover"
          />
        ) : null}
      </View>

      <Button
        mode="contained"
        buttonColor={colors.secondary}
        onPress={submitPayment}
        disabled={!canPay}
        style={{ marginTop: 12 }}
      >
        {posting ? "Submitting…" : "Pay"}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 364,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: colors.background,
    padding: 16,
    gap: 12,
  },
  label: { fontSize: 12, fontWeight: "700", color: colors.text, opacity: 0.8 },
  title: { fontSize: 16, fontWeight: "800", color: colors.text },
  shadow: {
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62 },
      android: { elevation: 4 },
    }),
  },
});

export default PaymentCheckoutCard;
