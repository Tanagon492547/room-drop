import { useCart } from "@/app/UseCart";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CartItem = {
  roomId: string;
  idUser: string;
  nameHotel: string;
  nameFull: string;
  address: string;
  price: number;       // ราคา (รวม) ต่อรายการในตะกร้า
  url: string;
  dateCheck: string;
  dateOut: string;
  dayCount: number;    // แค่โชว์ตัวเลข
};

type ConfirmState =
  | { visible: false }
  | { visible: true; mode: "remove"; id: string; title: string; message?: string }
  | { visible: true; mode: "clear"; title: string; message?: string };

export default function CartTab() {
  const { items, remove, clear, total } = useCart();
  const grand = useMemo(() => total(), [items]);
  const [confirm, setConfirm] = useState<ConfirmState>({ visible: false });

  const openConfirmRemove = (it: CartItem) =>
    setConfirm({
      visible: true,
      mode: "remove",
      id: it.roomId,
      title: "ลบรายการนี้?",
      message: it.nameHotel ? `คุณต้องการลบ “${it.nameHotel}” ออกจากตะกร้าหรือไม่` : undefined,
    });

  const openConfirmClear = () =>
    setConfirm({
      visible: true,
      mode: "clear",
      title: "ลบทั้งหมด?",
      message: "คุณต้องการลบทุกห้องออกจากตะกร้าใช่หรือไม่",
    });

  const closeConfirm = () => setConfirm({ visible: false });

  const doConfirm = () => {
    if (!confirm.visible) return;
    if (confirm.mode === "remove") remove(confirm.id);
    else clear();
    closeConfirm();
  };

  const renderItem = ({ item }: { item: CartItem }) => {
    const price = Number(item?.price ?? 0);
    const nights = Number(item?.dayCount ?? 0);
    const img = item?.url || "";

    return (
      <View style={s.card}>
        {img ? (
          <Image source={{ uri: img }} style={s.image} />
        ) : (
          <View style={[s.image, s.imgPlaceholder]}>
            <Text style={s.imgPlaceholderText}>No Image</Text>
          </View>
        )}

        <View style={s.body}>
          <Text style={s.titleHotel} numberOfLines={1}>
            {item?.nameHotel || "ไม่มีข้อมูล"}
          </Text>

          <Text style={s.subtitle} numberOfLines={2}>
            {item?.address || "ไม่มีข้อมูล"}
          </Text>

          <View style={s.infoBox}>
            <View style={s.infoRow}>
              <FontAwesome name="calendar-check-o" size={12} style={s.icon} />
              <Text style={s.infoText}>เช็คอิน: {item?.dateCheck || "-"}</Text>
            </View>
            <View style={s.infoRow}>
              <FontAwesome name="calendar-times-o" size={12} style={s.icon} />
              <Text style={s.infoText}>เช็คเอาท์: {item?.dateOut || "-"}</Text>
            </View>
            <View style={s.infoRow}>
              <FontAwesome name="moon-o" size={12} style={s.icon} />
              <Text style={s.infoText}>จำนวนคืน: {nights}</Text>
            </View>
          </View>

          <View style={s.bottomRow}>
            <View>
              <Text style={s.priceLabel}>ราคา (รวม)</Text>
              <Text style={s.priceValue}>฿{price.toLocaleString()}</Text>
            </View>
          </View>

          <View style={s.actions}>
            <TouchableOpacity
              style={[s.btn, s.btnGhost]}
              onPress={() => {
                // no-op: แสดงรายละเอียด (ค่อยผูกภายหลัง)
                if (!item?.roomId) return;
                // ⚠️ Use the actual route you have. If your file is (tabs)/roomdetails/[roomId].tsx:
                router.push({
                  pathname: "/(app)/(tabs)/roomdetails/[roomId]",
                  params: { roomId: item.roomId, nameHotel: item.nameHotel || "" },
                });

                // If your file is (tabs)/roomdetail/[roomId].tsx (without the "s"),
                // use this instead:
                // router.push({
                //   pathname: "/(app)/(tabs)/roomdetail/[roomId]",
                //   params: { roomId: item.roomId, nameHotel: item.nameHotel || "" },
                // });
              }}
            >
              <Text style={s.btnGhostText}>ดูรายละเอียด</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.btn, s.btnPrimary]}
              onPress={() => {
                // no-op: จอง/ชำระเงิน (ค่อยผูกภายหลัง)
              }}
            >
              <Text style={s.btnPrimaryText}>จอง</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.btn, s.btnDanger]}
              onPress={() => openConfirmRemove(item)}
            >
              <Text style={s.btnDangerText}>ลบ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={s.container}>

      {items.length === 0 ? (
        <View style={s.empty}>
          <FontAwesome name="shopping-bag" size={22} />
          <Text style={{ marginTop: 6 }}>ยังไม่มีห้องในตะกร้า</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(it) => it.roomId}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />

          {/* แถบสรุปรวมด้านล่าง */}
          <View style={s.footer}>
            <View style={{ flex: 1 }}>
              <Text style={s.totalLabel}>ยอดรวมทั้งหมด</Text>
              <Text style={s.totalValue}>฿{grand.toLocaleString()}</Text>
            </View>

            {/* ล้างทั้งหมด */}
            <TouchableOpacity
              style={[s.btn, s.btnDanger, { marginRight: 8 }]}
              onPress={openConfirmClear}>
              <Text style={s.btnDangerText}>ลบทั้งหมด</Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={[s.btn, s.btnPrimary]}
              onPress={() => {
                // no-op: ชำระเงิน
              }}
            >
              <Text style={s.btnPrimaryText}>ชำระเงิน</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Overlay */}
      {confirm.visible && (
        <View style={s.dialogBackdrop}>
          <View style={s.dialogCard}>
            <Text style={s.dialogTitle}>{confirm.title}</Text>
            {!!confirm.message && <Text style={s.dialogMsg}>{confirm.message}</Text>}

            <View style={s.dialogActions}>
              <TouchableOpacity style={[s.dialogBtn, s.dialogBtnOutlineBlue]} onPress={closeConfirm}>
                <Text style={s.dialogBtnBlueText}>ยกเลิก</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[s.dialogBtn, s.dialogBtnOutlineRed]} onPress={doConfirm}>
                <Text style={s.dialogBtnRedText}>
                  {confirm.mode === "remove" ? "ลบ" : "ลบทั้งหมด"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 12, width: "100%" },
  header: { fontSize: 22, fontWeight: "800", marginBottom: 8 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
  },
  image: {
    width: "100%",
    height: 170,
    backgroundColor: "#f3f4f6",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  imgPlaceholder: { justifyContent: "center", alignItems: "center" },
  imgPlaceholderText: { fontSize: 12 },

  body: { padding: 12 },

  titleHotel: { fontSize: 26, fontWeight: "800" },
  subtitle: { fontSize: 16, fontWeight: "700", color: "#6B7280", marginTop: 2 },

  infoBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  icon: { marginRight: 8, color: "#374151" },
  infoText: { fontSize: 13, fontWeight: "700" },

  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  priceLabel: { fontSize: 12 },
  priceValue: { fontSize: 22, fontWeight: "900", marginTop: 2 },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 10,
  },

  // ปุ่ม base
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  // ดูรายละเอียด (โทนฟ้าอ่อน)
  btnGhost: { backgroundColor: "#E5EDFF" },
  btnGhostText: { fontWeight: "800", color: "#1E3A8A" },
  // จอง (ทึบฟ้า)
  btnPrimary: { backgroundColor: "#1D4ED8" },
  btnPrimaryText: { fontWeight: "800", color: "#fff" },
  // ลบ (ทึบแดง)
  btnDanger: { backgroundColor: "#EF4444" },
  btnDangerText: { fontWeight: "800", color: "#fff" },

  totalLabel: { fontSize: 12 },
  totalValue: { fontSize: 18, fontWeight: "800" },

  footer: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
  },

  /* ====== Custom Confirm Overlay ====== */
  dialogBackdrop: {
    position: "absolute",
    inset: 0 as any,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  dialogCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  dialogTitle: { fontSize: 18, fontWeight: "800" },
  dialogMsg: { marginTop: 6, fontSize: 14 },

  dialogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },
  dialogBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  // ยกเลิก 
  dialogBtnOutlineBlue: {
    borderWidth: 2,
    borderColor: "#1D4ED8",
    backgroundColor: "transparent",
  },
  dialogBtnBlueText: { color: "#1D4ED8", fontWeight: "800" },
  // ลบ/ล้างทั้งหมด 
  dialogBtnOutlineRed: {
    borderWidth: 2,
    borderColor: "#EF4444",
    backgroundColor: "transparent",
  },
  dialogBtnRedText: { color: "#EF4444", fontWeight: "800" },
});

