import DropImageCard from "@/components/ui/DropImageCard";
import { colors } from "@/constants/Colors";
import { db } from "@/constants/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const BookingEvidence = () => {
  const params = useLocalSearchParams();
  const roomId = useMemo(() => {
    const v = params.roomId;
    return Array.isArray(v) ? v[0] : v;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [room, setRoom] = useState<any>(null);
  const [hotel, setHotel] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!roomId) {
          setError("Missing roomId");
          return;
        }

        const rRef = doc(db, "rooms", roomId);
        const rSnap = await getDoc(rRef);
        if (!rSnap.exists()) {
          setError("Room not found");
          return;
        }
        const r = rSnap.data();
        setRoom(r);

        if (r?.hotel_id) {
          const hRef = doc(db, "hotels", r.hotel_id);
          const hSnap = await getDoc(hRef);
          if (hSnap.exists()) setHotel(hSnap.data());
        }
      } catch (e) {
        console.error("Load evidence failed:", e);
        setError("Failed to load room.");
      } finally {
        setLoading(false);
      }
    })();
  }, [roomId]);

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

  const url = room?.room_photoURL || hotel?.hotel_photoURL || "";
  const name = room?.hotel_name || hotel?.hotel_name || "Unknown Hotel";
  const location = hotel?.hotel_location || room?.hotel_location || "-";
  const checkIn = room?.room_date_checkIn || "";
  const checkOut = room?.room_date_checkOut || "";
  const bill = room?.room_bill || ""; // <- main image for this page

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={[styles.card, styles.shadow]}>
        {/* Top: compact room card */}
        <View style={styles.headerRow}>
          <DropImageCard url={url} width={161} height={88} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.h1}>{name}</Text>
            <Text style={styles.h2}>{location}</Text>

            <View style={{ gap: 5, marginTop: 6 }}>
              <View style={[styles.boxContext]}>
                <Text style={styles.p2}>Check-in: </Text>
                <Text style={styles.p2b}>{checkIn}</Text>
              </View>
              <View style={[styles.boxContext]}>
                <Text style={styles.p2}>Check-out: </Text>
                <Text style={styles.p2b}>{checkOut}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main: room bill image */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.subtitle}>Room bill (evidence)</Text>
          {bill ? (
            <Image source={{ uri: bill }} style={styles.bill} resizeMode="cover" />
          ) : (
            <Text style={styles.p2}>No bill uploaded.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { padding: 16, alignItems: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    width: 364,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 16,
    gap: 12,
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  h1: { fontSize: 18, fontWeight: "800", color: colors.text },
  h2: { fontSize: 14, fontWeight: "700", color: colors.text, opacity: 0.7 },
  p2: { fontSize: 12, color: colors.text, opacity: 0.9 },
  p2b: { fontSize: 12, color: colors.text, fontWeight: "700" },
  boxContext: { flexDirection: "row", alignItems: "center", gap: 4 },
  subtitle: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 8 },
  bill: {
    width: "100%",
    height: 260,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
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
});

export default BookingEvidence;
