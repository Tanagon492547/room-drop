import { Text, View as TView } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import React, { memo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Card, Divider } from "react-native-paper";

import TitleText from "@/components/ui/TitleText";
import DetailCard, { HomeItem } from "@/components/ui/bookingscreens/DetailCard";

type Item = HomeItem & {
  createdAt?: string;
  booking_bill?: string | number;
  booking_status?: 0 | 1 | 2;
};
//Test data
const DATA: Item[] = [
  {
    room_id: "RD-TH-CNX-002",
    nameHotel: "Chiangmai Cozy Hotel",
    address: "45 ถ. นิมมานเหมินท์, เชียงใหม่ 50200",
    dateCheck: "2025-11-01",
    dateOut: "2025-11-04",
    price: 1299,
    dayCount: 3,
    createdAt: "2025-09-20 14:22",
    booking_bill: "BK-20251101-0102",
    booking_status: 1, // approve
    roomdetail: [
      "ห้องรีโนเวตใหม่ โทนไม้สว่าง",
      "เตียงคิงไซส์พร้อมหมอนหนุน 4 ใบ",
      "ที่จอดรถฟรี หน้าล็อบบี้",
      "ไม่มีอาหารเช้า",
    ],
  },
  {
    room_id: "RD-TH-PKT-003",
    nameHotel: "Udee Patong",
    address: "10 ถ. พระบารมี, ป่าตอง, ภูเก็ต 83150",
    dateCheck: "2025-12-20",
    dateOut: "2025-12-25",
    price: 2250,
    dayCount: 5,
    createdAt: "2025-09-10 08:00",
    booking_bill: "BK-20251220-0305",
    booking_status: 2, // cancel
    roomdetail: "ห้องขนาด 30 ตร.ม. ระเบียงนั่งเล่น เหมาะกับคู่รักหรือเพื่อน 2 คน",
  },
  {
    room_id: "RD-TH-KBI-004",
    nameHotel: "Ao Nang Bay Resort",
    address: "199 หมู่ 2, อ่าวนาง, กระบี่ 81180",
    dateCheck: "2026-01-10",
    dateOut: "2026-01-13",
    price: 1750,
    dayCount: 3,
    createdAt: "2025-09-25 18:45",
    booking_bill: "BK-20260110-4488",
    booking_status: 0, // waiting
    checkInTime: "14:30",
    checkOutTime: "12:00",
    roomdetail: {
      "ประเภทเตียง": "ทวิน",
      "ขนาดห้อง": "32 ตร.ม.",
      "ระเบียง": "มี",
    },
  },
];

const RowHeader = memo(function RowHeader({
  item,
  expanded,
  onPress,
}: {
  item: Item;
  expanded: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.rowHeader, pressed && { opacity: 0.9 }]}>
      <View style={s.leftCol}>
        <View style={s.inlineRow}>
          <FontAwesome name="calendar" size={12} />
          <Text style={s.leftDate}>{item.dateCheck}</Text>
        </View>
        <View style={[s.inlineRow, { marginTop: 6 }]}>
          <FontAwesome name="calendar-o" size={12} />
          <Text style={s.leftDate}>{item.dateOut}</Text>
        </View>
      </View>
      <View style={s.headerBody}>
        <Text style={s.hotel}>{item.nameHotel}</Text>
        <Text style={s.addr} numberOfLines={1}>
          ที่อยู่: {item.address}
        </Text>
        {typeof item.dayCount === "number" && (
          <Text style={s.nights}>จำนวนคืน: {item.dayCount} คืน</Text>
        )}
      </View>

      <FontAwesome name={expanded ? "chevron-up" : "chevron-down"} size={16} />
    </Pressable>
  );
});

const BookingRow = memo(function BookingRow({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);

  return (
    <Card mode="elevated" style={s.rowCard}>
      <RowHeader item={item} expanded={open} onPress={() => setOpen((v) => !v)} />
      {open && (
        <>
          <Divider />
          <View style={s.padBody}>
            <DetailCard
              base={item}
              booking_status={item.booking_status}
              booking_bill={item.booking_bill}
              createdAt={item.createdAt}
            />
          </View>
        </>
      )}
    </Card>
  );
});

/** ---------- Screen ---------- */
export default function BookingScreen() {
  return (
    <TView style={s.container} lightColor="#fff" darkColor="#fff">
      <TitleText textTitle="Room Detail" />
      <View style={s.content}>
        <FlatList
          data={DATA}
          keyExtractor={(it) => it.room_id}
          renderItem={({ item }) => <BookingRow item={item} />}
          contentContainerStyle={s.listPad}
          ListEmptyComponent={<View style={{ height: 1 }} />} // หน้าว่างจริง ๆ เมื่อไม่มีข้อมูล
        />
      </View>
    </TView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  listPad: { padding: 12, paddingBottom: 28 },

  rowCard: { backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", marginBottom: 12 },
  rowHeader: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 12 },

  leftCol: { width: 108 },
  inlineRow: { flexDirection: "row", alignItems: "center" },
  leftDate: { fontSize: 12, fontWeight: "700", color: "#0f172a", marginLeft: 6 },

  headerBody: { flex: 1, minWidth: 0, marginLeft: 12 },
  hotel: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  addr: { fontSize: 12, color: "#334155", marginTop: 2 },
  nights: { fontSize: 12, color: "#1e293b", marginTop: 6, fontWeight: "700" },

  padBody: { padding: 12 },
});
