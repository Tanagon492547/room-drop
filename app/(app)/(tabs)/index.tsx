// app/(tabs)/index.tsx หรือไฟล์ index.tsx ตามโปรเจกต์คุณ
import { View } from "@/components/Themed";
import ContainerCard from "@/components/ui/homes/ContainerCard";
import { db } from "@/constants/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  View as RNView,
  StyleSheet,
  Text,
} from "react-native";

// ============ Types ============
type RoomListItem = {
  room_id: string;
  hotel_id: string | null;
  user_id: string | null;
  hotel_name: string;
  hotel_location: string;
  room_date_checkIn: string;  // dd/MM/yyyy หรือ dd-MM-yyyy
  room_date_checkOut: string; // dd/MM/yyyy หรือ dd-MM-yyyy
  room_price: number;
  url: string;
  seller_name: string;
  dayCount: number;
};

// เงื่อนไขการค้นหาที่อ่านจาก AsyncStorage
type SearchState = {
  location?: string | null;
  checkIn?: string | null;   // ISO string
  checkOut?: string | null;  // ISO string
  priceMin?: string | null;
  priceMax?: string | null;
};

// ============ helpers ============
const STORAGE_KEY = "searchForm:v1";

const parseDMY = (s: string) => {
  if (!s) return null;
  const parts = s.split(/[\/-]/).map((x) => parseInt(x, 10));
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy) return null;
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  const t = Date.UTC(yyyy, mm - 1, dd);
  return Number.isNaN(t) ? null : t;
};

const diffDaysDMY = (checkIn: string, checkOut: string) => {
  const t1 = parseDMY(checkIn);
  const t2 = parseDMY(checkOut);
  if (t1 == null || t2 == null) return 0;
  const ms = t2 - t1;
  const days = Math.ceil(ms / 86_400_000);
  return days > 0 ? days : 0;
};

// ห้องครอบช่วงวันผู้ใช้หรือไม่ (roomRange ⊇ userRange)
const rangeContains = (roomIn: string, roomOut: string, userIn: Date, userOut: Date) => {
  const rIn = parseDMY(roomIn);
  const rOut = parseDMY(roomOut);
  if (rIn == null || rOut == null) return false;
  const uIn = Date.UTC(userIn.getUTCFullYear(), userIn.getUTCMonth(), userIn.getUTCDate());
  const uOut = Date.UTC(userOut.getUTCFullYear(), userOut.getUTCMonth(), userOut.getUTCDate());
  return rIn <= uIn && rOut >= uOut;
};

// แปลง ISO -> แสดงผลแบบ dd/MM/yy
const fmtShortDMY = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(d.getUTCFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
};

export default function TabOneScreen() {
  const [allRooms, setAllRooms] = useState<RoomListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // --- search state (อ่านจาก AsyncStorage) ---
  const [search, setSearch] = useState<SearchState | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // โหลด search state ครั้งแรก
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const s = JSON.parse(raw);
          setSearch({
            location: s.text ?? null,
            checkIn: s.checkIn ?? null,
            checkOut: s.checkOut ?? null,
            priceMin: s.priceMin ?? null,
            priceMax: s.priceMax ?? null,
          });
        } else {
          setSearch({}); // ไม่มีค่า ก็ให้เป็นว่าง
        }
      } catch (e) {
        console.warn("Failed to load search state", e);
        setSearch({});
      } finally {
        setInitialLoaded(true);
      }
    })();
  }, []);

   useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          if (!raw) return;
          const s = JSON.parse(raw);
          if (!cancelled) {
            setSearch({
              location: s.text ?? null,
              checkIn: s.checkIn ?? null,
              checkOut: s.checkOut ?? null,
              priceMin: s.priceMin ?? null,
              priceMax: s.priceMax ?? null,
            });
          }
        } catch (e) {
          console.warn('Failed to refresh search state on focus', e);
        }
      })();
      return () => { cancelled = true; };
    }, [])
  );

  // โหลด rooms และ join profiles/hotels (เหมือนเดิม)
  useEffect(() => {
    const qy = query(collection(db, "rooms"));
    const unsub = onSnapshot(
      qy,
      async (snap) => {
        try {
          const rooms = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

          const hotelIds = Array.from(
            new Set(rooms.map((r) => r.hotel_id).filter(Boolean))
          );
          const userIds = Array.from(
            new Set(rooms.map((r) => r.user_id).filter(Boolean))
          );

          const hotelEntries = await Promise.all(
            hotelIds.map(async (hid: string) => {
              const hs = await getDoc(doc(db, "hotels", hid));
              return [hid, hs.exists() ? hs.data() : null] as const;
            })
          );
          const hotelMap = new Map<string, any>(hotelEntries);

          const profileEntries = await Promise.all(
            userIds.map(async (uid: string) => {
              const ps = await getDoc(doc(db, "profile", uid));
              return [uid, ps.exists() ? ps.data() : null] as const;
            })
          );
          const profileMap = new Map<string, any>(profileEntries);

          const list: RoomListItem[] = rooms.map((r: any) => {
            const hotel = r.hotel_id ? hotelMap.get(r.hotel_id) : null;
            const prof = r.user_id ? profileMap.get(r.user_id) : null;

            const hotel_name = r.hotel_name || hotel?.hotel_name || "Unknown Hotel";
            const hotel_location = hotel?.hotel_location || r.hotel_location || "-";
            const room_date_checkIn = r.room_date_checkIn || "";
            const room_date_checkOut = r.room_date_checkOut || "";
            const room_price = Number(r.room_price ?? 0);
            const url = r.room_photoURL || hotel?.hotel_photoURL || "";
            const seller_name = prof
              ? `${prof.fname ?? ""} ${prof.lname ?? ""}`.trim() || "Unknown"
              : "Unknown";
            const computedDayCount = diffDaysDMY(
              room_date_checkIn,
              room_date_checkOut
            );

            return {
              room_id: r.id,
              hotel_id: r.hotel_id ?? null,
              user_id: r.user_id ?? null,
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

          setAllRooms(list);

          // sync dayCount กลับ (แบบเดิม)
          const updates = rooms.map(async (r: any) => {
            const computed = diffDaysDMY(
              r.room_date_checkIn,
              r.room_date_checkOut
            );
            const current = typeof r.dayCount === "number" ? r.dayCount : null;
            if (computed !== current) {
              try {
                await updateDoc(doc(db, "rooms", r.id), { dayCount: computed });
              } catch (err) {
                console.warn(`Failed to update dayCount for room ${r.id}:`, err);
              }
            }
          });
          await Promise.allSettled(updates);
        } catch (e) {
          console.error("Index load error:", e);
          Alert.alert("Error", "Cannot load rooms.");
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      (err) => {
        console.error("Index snapshot error:", err);
        setLoading(false);
        setRefreshing(false);
        Alert.alert("Error", "Cannot listen to rooms.");
      }
    );
    return () => unsub();
  }, []);

  // กรองฝั่ง client ตาม search state (ถ้ามี)
  const filtered = useMemo(() => {
    if (!search) return allRooms;

    const hasLocation = !!search.location && search.location.trim() !== "";
    const min = search.priceMin ? parseInt(search.priceMin, 10) : undefined;
    const max = search.priceMax ? parseInt(search.priceMax, 10) : undefined;
    const hasDate = !!search.checkIn && !!search.checkOut;

    const inDate = hasDate
      ? {
          inDate: new Date(search.checkIn as string),
          outDate: new Date(search.checkOut as string),
        }
      : null;

    return allRooms.filter((r) => {
      // location
      if (hasLocation && r.hotel_location !== (search.location as string)) {
        return false;
      }
      // price
      if (typeof min === "number" && r.room_price < min) return false;
      if (typeof max === "number" && r.room_price > max) return false;

      // date range: ให้ห้องต้องครอบช่วงที่ผู้ใช้ขอ
      if (inDate && !rangeContains(r.room_date_checkIn, r.room_date_checkOut, inDate.inDate, inDate.outDate)) {
        return false;
      }
      return true;
    });
  }, [allRooms, search]);

  // สร้างข้อความสรุปคำค้น เพื่อ UX หลังค้นหา
  const summaryText = useMemo(() => {
    if (!search) return "";
    const parts: string[] = [];
    if (search.location) parts.push(`${search.location}`);
    if (search.checkIn && search.checkOut) {
      parts.push(`${fmtShortDMY(search.checkIn)}–${fmtShortDMY(search.checkOut)}`);
    }
    const pMin = search.priceMin ? Number(search.priceMin) : undefined;
    const pMax = search.priceMax ? Number(search.priceMax) : undefined;
    if (pMin !== undefined || pMax !== undefined) {
      const minS = pMin !== undefined ? pMin.toLocaleString() : "0";
      const maxS = pMax !== undefined ? pMax.toLocaleString() : "∞";
      parts.push(`฿${minS}–฿${maxS}`);
    }
    return parts.join(" · ");
  }, [search]);

  // รีเฟรช
  const onRefresh = () => {
    setRefreshing(true);
    // onSnapshot อยู่แล้วจึงไม่ต้องทำอะไรเพิ่ม
  };

  const clearFilters = async () => {
    setSearch({});
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        // เคลียร์เฉพาะค่าที่เป็นตัวกรอง แต่ไม่ลบคีย์ทิ้ง (กันหน้าอื่นพัง)
        s.text = "";
        s.checkIn = null;
        s.checkOut = null;
        s.priceMin = "";
        s.priceMax = "";
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      }
    } catch (e) {
      console.warn("Failed to clear filters", e);
    }
  };

  if (!initialLoaded) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  const isFiltering =
    !!(search?.location && search.location.trim()) ||
    !!(search?.checkIn && search?.checkOut) ||
    !!(search?.priceMin && search.priceMin !== "") ||
    !!(search?.priceMax && search.priceMax !== "");

  return (
    <View style={styles.container}>
      {/* แบนเนอร์สรุปคำค้น */}
      {isFiltering ? (
        <RNView style={styles.banner}>
          <Text style={styles.bannerTitle}>ผลการค้นหา</Text>
          <Text style={styles.bannerSubtitle} numberOfLines={2}>
            {summaryText || "—"}
          </Text>
          <Pressable onPress={clearFilters} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>ล้างตัวกรอง</Text>
          </Pressable>
        </RNView>
      ) : (
        <RNView style={styles.banner}>
          <Text style={styles.bannerTitle}>ข้อเสนอทั้งหมด</Text>
          <Text style={styles.bannerSubtitle}>ดูห้องที่ปล่อยล่าสุดทั้งหมด</Text>
        </RNView>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.room_id}
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
        contentContainerStyle={{
          paddingRight: 0,
          paddingLeft: 16,
          backgroundColor: "transparent",
          paddingBottom: 24,
        }}
        style={{ backgroundColor: "transparent" }}
        refreshControl={
          <RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <RNView style={{ padding: 24 }}>
            <Text style={{ textAlign: "center" }}>
              {isFiltering
                ? "ไม่พบห้องที่ตรงกับเงื่อนไข ลองปรับตัวกรองให้กว้างขึ้น"
                : "ยังไม่มีข้อมูลห้อง"}
            </Text>
          </RNView>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    marginVertical: 10,
    backgroundColor: "transparent",
  },
  banner: {
    marginHorizontal: 16,
    marginBottom: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#ECF2FF",
  },
  bannerTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  bannerSubtitle: { fontSize: 12, color: "#333" },
  clearBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
  },
  clearBtnText: { fontWeight: "700" },
});
