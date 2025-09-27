import { Text } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Divider } from "react-native-paper";

export type HomeItem = {
  room_id: string;
  nameHotel: string;
  address: string;
  dateCheck: string;   // YYYY-MM-DD
  dateOut: string;     // YYYY-MM-DD
  price?: number;
  dayCount?: number;   // แสดงเมื่อมีค่าเท่านั้น
  checkInTime?: string;   // e.g. "15:00" //ถ้าไม่มีลบไปเลย
  checkOutTime?: string;  // e.g. "11:00" //ถ้าไม่มีลบไปเลย
  roomdetail?:
    | string
    | string[]
    | Record<string, any>
    | Array<{ label: string; value: any; icon?: keyof typeof FontAwesome.glyphMap }>;
};

const STATUS: Record<0 | 1 | 2, { label: string; fg: string; bg: string; border: string }> = {
  0: { label: "waiting", fg: "#92400E", bg: "#FEF3C7", border: "#F59E0B" },
  1: { label: "approve", fg: "#065F46", bg: "#D1FAE5", border: "#10B981" },
  2: { label: "cancel",  fg: "#991B1B", bg: "#FEE2E2", border: "#EF4444" },
};

const InfoRow = ({
  icon, label, value, style,
}: {
  icon?: keyof typeof FontAwesome.glyphMap;
  label: string;
  value: React.ReactNode;
  style?: any;
}) => (
  <View style={[s.kvRow, style]}>
    <View style={s.kvLeft}>
      <FontAwesome name={icon ?? "circle"} size={10} style={s.kvIcon} />
      <Text style={s.kvKey}>{label}</Text>
    </View>
    <Text style={s.kvVal}>{String(value)}</Text>
  </View>
);

type Props = {
  base: HomeItem;
  booking_status?: 0 | 1 | 2;       // ไม่มีค่า -> ไม่แสดงชิป
  booking_bill?: string | number;    // ไม่มีค่า -> ไม่แสดง
  createdAt?: string;                // ไม่มีค่า -> โชว์ "-"
};

export default function DetailCard({ base, booking_status, booking_bill, createdAt }: Props) {
  const stat = booking_status !== undefined ? STATUS[booking_status] : undefined;
  const priceText = Number(base.price ?? 0).toLocaleString("th-TH");

  // เวลา: ใช้เฉพาะที่ backend ให้มา (ไม่มีเวลา -> แสดงเฉพาะวันที่) //ถ้าไม่มีลบไปเลย
  const checkInDisplay  = base.checkInTime  ? `${base.dateCheck} ${base.checkInTime}`  : base.dateCheck;
  const checkOutDisplay = base.checkOutTime ? `${base.dateOut} ${base.checkOutTime}`   : base.dateOut;

  const renderRoomDetail = (desc: HomeItem["roomdetail"]) => {
    if (!desc) return <Text style={s.muted}>-</Text>;

    if (typeof desc === "string") return <Text style={s.descText}>{desc}</Text>;

    if (Array.isArray(desc) && desc.every((d) => typeof d === "string")) {
      return (
        <View style={s.descList}>
          {desc.map((line, i) => (
            <View key={i} style={s.bulletRow}>
              <Text style={s.bulletDot}>•</Text>
              <Text style={s.bulletText}>{line}</Text>
            </View>
          ))}
        </View>
      );
    }

    if (Array.isArray(desc) && desc.every((d) => typeof d === "object" && d && "label" in d && "value" in d)) {
      return (
        <View>
          {desc.map((it: any, i: number) => (
            <InfoRow key={i} icon={it.icon} label={it.label} value={it.value} />
          ))}
        </View>
      );
    }

    if (typeof desc === "object") {
      return (
        <View>
          {Object.entries(desc as Record<string, any>).map(([k, v]) => (
            <InfoRow key={k} label={k} value={v} />
          ))}
        </View>
      );
    }

    return <Text style={s.muted}>-</Text>;
  };

  return (
    <Card mode="outlined" style={s.card}>
      <View style={[s.row, s.between, s.padHeader]}>
        <Text style={s.title}>รายละเอียดการจอง</Text>
        <View style={{ alignItems: "flex-end" }}>
          {stat && (
            <View style={[s.chip, { backgroundColor: stat.bg, borderColor: stat.border }]}>
              <Text style={[s.sm, s.bold, { color: stat.fg, textTransform: "capitalize" }]}>{stat.label}</Text>
            </View>
          )}
          <Text style={s.price}>THB {priceText}</Text>
          {booking_bill !== undefined && (
            <Text style={[s.sm, s.bookingNo]}>หมายเลขการจอง: {String(booking_bill)}</Text>
          )}
        </View>
      </View>

      <Divider />

      {/* โรงแรม + เวลาสร้าง */}
      <View style={s.section}>
        <Text style={[s.strong, s.md]}>{base.nameHotel}</Text>
        <Text style={[s.sm, s.muted]}>สร้างเมื่อ: {createdAt || "-"}</Text>
      </View>

      {/* เช็คอิน/เช็คเอาท์ + จำนวนคืน */}
      <View style={[s.section, { paddingTop: 0 }]}>
        <View style={s.dateRowTop}>
          <View>
            <Text style={s.p1}>เช็คอิน</Text>
            <Text style={s.p2}>{checkInDisplay}</Text>
          </View>

          <FontAwesome name="arrow-right" size={20} color="#0f172a" />

          <View>
            <Text style={s.p1}>เช็คเอาท์</Text>
            <Text style={s.p2}>{checkOutDisplay}</Text>
          </View>
        </View>

        {typeof base.dayCount === "number" && (
          <Text style={s.nightsNote}>จำนวนคืน: {base.dayCount} คืน</Text>
        )}
      </View>

      <Divider />

      {/* รายละเอียดห้องพัก (จาก roomdetail ) */}
      <View style={s.section}>
        <Text style={[s.md, s.bold, { marginBottom: 6 }]}>รายละเอียดห้องพัก</Text>
        {renderRoomDetail(base.roomdetail)}
      </View>

      {/* ที่อยู่/พิกัด */}
      <View style={s.mapCard}>
        <FontAwesome name="map-marker" size={16} />
        <Text style={[s.sm, s.strong, { flex: 1 }]}>{base.address}</Text>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 14, borderColor: "#e5e7eb" },
  section: { paddingHorizontal: 12, paddingVertical: 10 },

  row: { flexDirection: "row", alignItems: "center" },
  between: { justifyContent: "space-between" },
  padHeader: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8 },

  sm: { fontSize: 12 }, md: { fontSize: 13 },
  title: { fontSize: 14, fontWeight: "800", color: "#0f172a" },
  strong: { fontWeight: "800", color: "#0f172a" },
  bold: { fontWeight: "800" },
  muted: { color: "#334155" },
  price: { fontSize: 16, fontWeight: "900", color: "#ef4444" },
  bookingNo: { color: "#0f172a", marginTop: 4 },

  // เช็คอิน/เอาท์
  dateRowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  p1: { fontSize: 10, color: "#0f172a", opacity: 0.6 },
  p2: { fontSize: 15, color: "#0f172a", fontWeight: "bold" },
  nightsNote: { marginTop: 8, fontSize: 12, fontWeight: "700", color: "#0f172a", alignSelf: "flex-end" },

  // key-value with icons
  kvRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  kvLeft: { flexDirection: "row", alignItems: "center" },
  kvIcon: { marginRight: 8, color: "#475569" },
  kvKey: { fontSize: 12, color: "#475569" },
  kvVal: { fontSize: 12, fontWeight: "700", color: "#0f172a" },

  // roomdetail
  descText: { fontSize: 12, color: "#0f172a", lineHeight: 18 },
  descList: { gap: 6 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  bulletDot: { fontSize: 14, lineHeight: 18, color: "#0f172a" },
  bulletText: { flex: 1, fontSize: 12, color: "#0f172a", lineHeight: 18 },

  chip: { alignSelf: "flex-end", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, marginTop: 6, marginBottom: 6 },

  mapCard: {
    backgroundColor: "#f1f5f9",
    marginHorizontal: 12,
    marginVertical: 10,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
