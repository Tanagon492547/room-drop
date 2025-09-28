import { colors } from "@/constants/Colors";
import { db } from "@/constants/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { Button } from "react-native-paper";

type Buyer = {
  fname?: string;
  lname?: string;
  telephone_number?: string;
  email?: string;
  photoURL?: string;
};

const ConfirmPayment = () => {
  const params = useLocalSearchParams();
  const roomIdParam = useMemo(() => {
    const v = params.roomId;
    return Array.isArray(v) ? v[0] : v;
  }, [params]);
  const bookingIdParam = useMemo(() => {
    const v = params.bookingId;
    return Array.isArray(v) ? v[0] : v;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data
  const [roomId, setRoomId] = useState<string>("");
  const [bookingId, setBookingId] = useState<string>("");
  const [buyer, setBuyer] = useState<Buyer>({});
  const [bookingBill, setBookingBill] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        if (!bookingIdParam && !roomIdParam) {
          setError("Missing bookingId or roomId.");
          return;
        }

        // 1) Load booking by bookingId (preferred)
        if (bookingIdParam) {
          const bRef = doc(db, "bookings", bookingIdParam);
          const bSnap = await getDoc(bRef);
          if (!bSnap.exists()) {
            setError("Booking not found.");
            return;
          }
          const b = bSnap.data() as any;
          setBookingId(bookingIdParam);
          setRoomId(b.room_id);
          setBookingBill(b.booking_bill ?? "");

          // 2) Load buyer profile
          const buyerId: string | undefined = b.user_id;
          if (buyerId) {
            const pRef = doc(db, "profile", buyerId);
            const pSnap = await getDoc(pRef);
            if (pSnap.exists()) {
              const p = pSnap.data() as any;
              setBuyer({
                fname: p.fname ?? "",
                lname: p.lname ?? "",
                telephone_number: p.telephone_number ?? "",
                email: p.email ?? "",
                photoURL: p.photoURL ?? "",
              });
            }
          }
        } else {
          // If only roomId was provided (fallback), you could query pending bookings here.
          // For now, we require bookingId for correctness:
          setError("Missing bookingId.");
          return;
        }
      } catch (e) {
        console.error("Load confirmPayment failed:", e);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingIdParam, roomIdParam]);

  const onApprove = async () => {
    try {
      if (!roomId || !bookingId) return;
      setPosting(true);

      // room_status = 0 (sold), booking_status = 1 (approved)
      const batch = writeBatch(db);
      batch.update(doc(db, "rooms", roomId), {
        room_status: 0,
        updatedAt: serverTimestamp(),
      });
      batch.update(doc(db, "bookings", bookingId), {
        booking_status: 1,
        updatedAt: serverTimestamp(),
      });
      await batch.commit();

      Alert.alert("Success", "Booking approved.");
      router.back();
    } catch (e: any) {
      console.error("Approve failed:", e);
      Alert.alert("Error", "Failed to approve booking.");
    } finally {
      setPosting(false);
    }
  };

  const onCancel = async () => {
    try {
      if (!roomId || !bookingId) return;
      setPosting(true);

      // room_status = 1 (available), booking_status = 2 (canceled)
      const batch = writeBatch(db);
      batch.update(doc(db, "rooms", roomId), {
        room_status: 1,
        updatedAt: serverTimestamp(),
      });
      batch.update(doc(db, "bookings", bookingId), {
        booking_status: 2,
        updatedAt: serverTimestamp(),
      });
      await batch.commit();

      Alert.alert("Canceled", "Booking rejected.");
      router.back();
    } catch (e: any) {
      console.error("Cancel failed:", e);
      Alert.alert("Error", "Failed to cancel booking.");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }
  if (error) {
    Alert.alert("Error", error);
    return <View style={styles.center} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={[styles.card, styles.shadow]}>
        <Text style={styles.title}>Customer</Text>

        <View style={styles.buyerRow}>
          <View style={styles.avatarWrap}>
            {buyer.photoURL ? (
              <Image
                source={{ uri: buyer.photoURL }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {(buyer.fname || "") + (buyer.lname ? ` ${buyer.lname}` : "")}
            </Text>
            <Text style={styles.line}>{buyer.email || "-"}</Text>
            <Text style={styles.line}>{buyer.telephone_number || "-"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Payment Slip</Text>
          {bookingBill ? (
            <Image
              source={{ uri: bookingBill }}
              style={styles.slip}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.line}>No slip uploaded.</Text>
          )}
        </View>

        <View style={styles.buttons}>
          <Button
            mode="contained"
            onPress={onApprove}
            disabled={posting}
            style={[styles.btn, styles.btnApprove]}
          >
            {posting ? "Processing..." : "Confirm"}
          </Button>
          <Button
            mode="outlined"
            onPress={onCancel}
            disabled={posting}
            style={[styles.btn, styles.btnCancel]}
          >
            Cancel
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 16,
    alignItems: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 364,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  buyerRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    backgroundColor: "#e5e7eb",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  line: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.8,
  },
  section: {
    marginTop: 8,
    gap: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  slip: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  btn: {
    flex: 1,
    borderRadius: 8,
  },
  btnApprove: {
    backgroundColor: colors.secondary,
  },
  btnCancel: {},
  shadow: {
    ...({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
      },
      android: { elevation: 4 },
    } as any)[Platform.OS],
  },
});

export default ConfirmPayment;

