// components/ui/bookings/BookingList.tsx
import DropImageCard from "@/components/ui/DropImageCard";
import { colors } from "@/constants/Colors";
import { auth, db } from "@/constants/firebaseConfig";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

type BookingItem = {
  bookingId: string;
  status: number; // 0 waiting, 1 approved, 2 canceled
  roomId: string;
  hotelName: string;
  hotelLocation: string;
  checkIn: string;
  checkOut: string;
  url: string;
};

const chunk = <T,>(arr: T[], size = 10): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const BookingList = () => {
  const [items, setItems] = useState( [] as BookingItem[] );
  const [loading, setLoading] = useState(true);

  const uid = useMemo(() => auth.currentUser?.uid ?? null, []);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const qB = query(collection(db, "bookings"), where("user_id", "==", uid));
    const unsub = onSnapshot(
      qB,
      async (snap) => {
        try {
          const bookingsRaw = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

          // gather room ids
          const roomIds = bookingsRaw.map((b) => b.room_id).filter(Boolean) as string[];
          const roomChunks = chunk(roomIds, 10);

          // load rooms
          const roomMap = new Map<string, any>();
          for (const ids of roomChunks) {
            if (!ids.length) continue;
            await Promise.all(
              ids.map(async (rid) => {
                if (roomMap.has(rid)) return;
                const rs = await getDoc(doc(db, "rooms", rid));
                if (rs.exists()) roomMap.set(rid, rs.data());
              })
            );
          }

          // hotels
          const hotelIds = Array.from(
            new Set(
              Array.from(roomMap.values())
                .map((r: any) => r.hotel_id)
                .filter(Boolean)
            )
          ) as string[];

          const hotelMap = new Map<string, any>();
          await Promise.all(
            hotelIds.map(async (hid) => {
              const hs = await getDoc(doc(db, "hotels", hid));
              if (hs.exists()) hotelMap.set(hid, hs.data());
            })
          );

          const list: BookingItem[] = bookingsRaw.map((b) => {
            const r = roomMap.get(b.room_id) || {};
            const h = r.hotel_id ? hotelMap.get(r.hotel_id) : null;

            return {
              bookingId: b.id,
              status: Number.isFinite(Number(b.booking_status))
                ? Number(b.booking_status)
                : 0,
              roomId: b.room_id,
              hotelName: r.hotel_name || h?.hotel_name || "Unknown Hotel",
              hotelLocation: h?.hotel_location || r.hotel_location || "-",
              checkIn: r.room_date_checkIn || "",
              checkOut: r.room_date_checkOut || "",
              url: r.room_photoURL || h?.hotel_photoURL || "",
            };
          });

          setItems(list);
        } catch (e) {
          console.error("Load bookings failed:", e);
          Alert.alert("Error", "Cannot load bookings right now.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Bookings snapshot error:", err);
        setLoading(false);
        Alert.alert("Error", "Cannot listen to your bookings.");
      }
    );

    return () => unsub();
  }, [uid]);

  const renderStatusPill = (status: number) => {
    if (status === 1) return null;
    const label = status === 2 ? "Canceled" : "Waiting";
    const bg = status === 2 ? "#EF4444" : "#9CA3AF";
    return (
      <View style={[styles.statusPill, { backgroundColor: bg }]}>
        <Text style={styles.statusText}>{label}</Text>
      </View>
    );
  };

  const goEvidence = (roomId: string) => {
    if (!roomId) return;
    router.push({
      pathname: "/(app)/(tabs)/bookingEvidence",
      params: { roomId },
    });
  };

  return (
    <SwipeListView
      data={items}
      keyExtractor={(it) => it.bookingId}
      rightOpenValue={-1}
      disableRightSwipe
      renderItem={({ item }) => (
        <View style={styles.visibleItem}>
          <View>
            <DropImageCard url={item.url} />
          </View>

          <View style={styles.rightCol}>
            <Text style={styles.itemName}>{item.hotelName}</Text>

            <View style={styles.rowBetween}>
              <Text style={styles.p} numberOfLines={1}>
                {item.hotelLocation}
              </Text>
              {renderStatusPill(item.status)}
            </View>

            <View style={{ gap: 5 }}>
              <View style={styles.boxContext}>
                <FontAwesome name="calendar-check-o" size={20} color="#000000ff" />
                <Text style={styles.p2}>{item.checkIn}</Text>
              </View>
              <View style={styles.boxContext}>
                <FontAwesome name="calendar-times-o" size={20} color="#000000ff" />
                <Text style={styles.p2}>{item.checkOut}</Text>
              </View>
            </View>

            {item.status === 1 ? (
              <TouchableOpacity
                style={styles.evidenceBtn}
                onPress={() => goEvidence(item.roomId)}
              >
                <Text style={styles.evidenceText}>Room evidence</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}
      style={{ width: "100%" }}
    />
  );
};

const styles = StyleSheet.create({
  visibleItem: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    gap: 10,
    width: "100%",
    minHeight: 165, // ← allow content to grow
  },
  rightCol: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  p: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textLight,
  },
  p2: { fontSize: 10 },
  boxContext: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: { color: "white", fontSize: 12, fontWeight: "700" },
  evidenceBtn: {
    alignSelf: "flex-end", // ← stays inside the card
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
  },
  evidenceText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.3,
  },
});

export default BookingList;

