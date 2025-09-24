import { View } from "@/components/Themed";
import ContainerCard from "@/components/ui/homes/ContainerCard";
import { db } from "@/constants/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet } from "react-native";

// Type coming out of Firestore (rooms + joins we add)
type RoomListItem = {
  room_id: string;                 // rooms doc id
  hotel_id: string | null;
  user_id: string | null;
  hotel_name: string;
  hotel_location: string;
  room_date_checkIn: string;       // "dd/MM/yyyy" (or "dd-MM-yyyy")
  room_date_checkOut: string;      // "dd/MM/yyyy" (or "dd-MM-yyyy")
  room_price: number;
  url: string;                     // prefer room_photoURL, fallback to hotel_photoURL
  seller_name: string;             // from profile/{user_id} fname/lname
  dayCount: number;
};

// --- helpers: parse & diff days for dd/MM/yyyy (or dd-MM-yyyy) safely using UTC ---
const parseDMY = (s: string) => {
  if (!s) return null;
  // Accept 22/10/2025 or 22-10-2025
  const parts = s.split(/[\/-]/).map((x) => parseInt(x, 10));
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy) return null;
  // Validate rough ranges
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  // Return UTC epoch for midnight of that date
  const t = Date.UTC(yyyy, mm - 1, dd);
  return Number.isNaN(t) ? null : t;
};

const diffDaysDMY = (checkIn: string, checkOut: string) => {
  const t1 = parseDMY(checkIn);
  const t2 = parseDMY(checkOut);
  if (t1 == null || t2 == null) return 0;
  const ms = t2 - t1;
  // If checkout is the same day or earlier, treat as 0 nights
  const days = Math.ceil(ms / 86_400_000);
  return days > 0 ? days : 0;
};

export default function TabOneScreen() {
  const [data, setData] = useState<RoomListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "rooms"));
    const unsub = onSnapshot(
      q,
      async (snap) => {
        try {
          const rooms = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

          // collect hotel_ids and user_ids
          const hotelIds = Array.from(new Set(rooms.map((r) => r.hotel_id).filter(Boolean)));
          const userIds  = Array.from(new Set(rooms.map((r) => r.user_id ).filter(Boolean)));

          // fetch hotels
          const hotelEntries = await Promise.all(
            hotelIds.map(async (hid: string) => {
              const hs = await getDoc(doc(db, "hotels", hid));
              return [hid, hs.exists() ? hs.data() : null] as const;
            })
          );
          const hotelMap = new Map<string, any>(hotelEntries);

          // fetch seller profiles
          const profileEntries = await Promise.all(
            userIds.map(async (uid: string) => {
              const ps = await getDoc(doc(db, "profile", uid));
              return [uid, ps.exists() ? ps.data() : null] as const;
            })
          );
          const profileMap = new Map<string, any>(profileEntries);

          // Build list + compute dayCount
          const list: RoomListItem[] = rooms.map((r: any) => {
            const hotel = r.hotel_id ? hotelMap.get(r.hotel_id) : null;
            const prof  = r.user_id  ? profileMap.get(r.user_id)  : null;

            const hotel_name      = r.hotel_name || hotel?.hotel_name || "Unknown Hotel";
            const hotel_location  = hotel?.hotel_location || r.hotel_location || "-";
            const room_date_checkIn  = r.room_date_checkIn  || "";
            const room_date_checkOut = r.room_date_checkOut || "";
            const room_price      = Number(r.room_price ?? 0);
            const url             = r.room_photoURL || hotel?.hotel_photoURL || "";
            const seller_name     = prof ? `${prof.fname ?? ""} ${prof.lname ?? ""}`.trim() || "Unknown" : "Unknown";

            const computedDayCount = diffDaysDMY(room_date_checkIn, room_date_checkOut);

            return {
              room_id: r.id,
              hotel_id: r.hotel_id ?? null,
              user_id:  r.user_id  ?? null,
              hotel_name,
              hotel_location,
              room_date_checkIn,
              room_date_checkOut,
              room_price,
              url,
              seller_name,
              dayCount: computedDayCount,
            };
          });

          setData(list);

          // --- Persist dayCount back to Firestore if it differs/missing ---
          // Guard: only write when needed to avoid snapshot loops.
          const updates = rooms.map(async (r: any) => {
            const computed = diffDaysDMY(r.room_date_checkIn, r.room_date_checkOut);
            const current  = typeof r.dayCount === "number" ? r.dayCount : null;
            if (computed !== current) {
              try {
                await updateDoc(doc(db, "rooms", r.id), { dayCount: computed });
              } catch (err) {
                console.warn(`Failed to update dayCount for room ${r.id}:`, err);
              }
            }
          });
          // Don’t block UI; no need to await, but you can:
          await Promise.allSettled(updates);

        } catch (e) {
          console.error("Index load error:", e);
          Alert.alert("Error", "Cannot load rooms.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Index snapshot error:", err);
        setLoading(false);
        Alert.alert("Error", "Cannot listen to rooms.");
      }
    );

    return () => unsub();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ContainerCard
            nameHotel={item.hotel_name}
            sellerName={item.seller_name}
            idUser={item.user_id ?? ""}
            address={item.hotel_location}
            price={item.room_price}
            url={item.url}
            dateCheck={item.room_date_checkIn}
            dateOut={item.room_date_checkOut}
            roomId={item.room_id}
            dayCount={item.dayCount}
          />
        )}
        keyExtractor={(item) => item.room_id}
        contentContainerStyle={{
          paddingRight: 0,
          paddingLeft: 16,
          backgroundColor: "transparent",
        }}
        style={{ backgroundColor: "transparent" }}
        refreshing={loading}
        onRefresh={() => { /* snapshot keeps it fresh; noop */ }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10, // (avoid marginBlock in RN)
    backgroundColor: "transparent",
  },
});

