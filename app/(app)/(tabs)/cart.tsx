import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ Firebase
import { auth, db } from "@/constants/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

type CartRow = {
  cart_id: string;
  room_id: string;
};

type CartItem = {
  cartId: string;      // Firestore carts doc id
  roomId: string;      // rooms doc id
  idUser: string;      // owner of the room (seller) if you want later
  nameHotel: string;
  nameFull: string;    // seller_name if you stored it (optional)
  address: string;
  price: number;
  url: string;
  dateCheck: string;
  dateOut: string;
  dayCount: number;
};

const FALLBACK =
  "https://as1.ftcdn.net/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg";

const isHttp = (u?: string) => !!u && (u.startsWith("http://") || u.startsWith("https://"));
const isGs = (u?: string) => !!u && u.startsWith("gs://");
const isFile = (u?: string) => !!u && u.startsWith("file://");

// Resolve a room image into something the <Image> can display
const resolveRoomImage = async (raw?: string) => {
  try {
    if (!raw) return FALLBACK;
    if (isHttp(raw) || isFile(raw)) return raw; // file:// works on same device that picked it
    if (isGs(raw)) {
      const storage = getStorage();
      return await getDownloadURL(ref(storage, raw));
    }
    return FALLBACK;
  } catch {
    return FALLBACK;
  }
};

export default function CartTab() {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CartItem[]>([]);

  // Subscribe to /carts for this user, then hydrate with rooms data
  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "carts"), where("user_id", "==", user.uid));
    const unsub = onSnapshot(
      q,
      async (snap) => {
        try {
          const rows: CartRow[] = snap.docs.map((d) => ({
            cart_id: d.id,
            room_id: (d.data() as any)?.room_id,
          }));

          // Fetch each room
          const withRooms = await Promise.all(
            rows.map(async (row) => {
              if (!row.room_id) return null;
              const rs = await getDoc(doc(db, "rooms", row.room_id));
              if (!rs.exists()) return null;
              const r = rs.data() as any;

              const img = await resolveRoomImage(r.room_photoURL);

              const item: CartItem = {
                cartId: row.cart_id,
                roomId: row.room_id,
                idUser: String(r.user_id ?? ""),
                nameHotel: String(r.hotel_name ?? "ไม่มีข้อมูล"),
                nameFull: String(r.seller_name ?? ""), // if you store it
                address: String(r.hotel_location ?? "ไม่มีข้อมูล"),
                price: Number(r.room_price ?? 0),
                url: img,
                dateCheck: String(r.room_date_checkIn ?? "-"),
                dateOut: String(r.room_date_checkOut ?? "-"),
                dayCount: Number(r.dayCount ?? 0),
              };
              return item;
            })
          );

          setItems(withRooms.filter(Boolean) as CartItem[]);
        } catch (e) {
          console.log("[Cart] hydrate error:", e);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.log("[Cart] listen error:", err);
        setLoading(false);
      }
    );

    return unsub;
  }, [user?.uid]);

  const grand = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.price ?? 0), 0),
    [items]
  );

  const remove = async (roomId: string) => {
    // find the cart doc for this room
    const row = items.find((it) => it.roomId === roomId);
    if (!row) return;
    try {
      await deleteDoc(doc(db, "carts", row.cartId));
    } catch (e) {
      console.log("[Cart] remove error:", e);
    }
  };

  const clear = async () => {
    try {
      await Promise.all(items.map((it) => deleteDoc(doc(db, "carts", it.cartId))));
    } catch (e) {
      console.log("[Cart] clear error:", e);
    }
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


            <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={() => { }}>
              <Text style={s.btnPrimaryText}>จอง</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.btn, s.btnDanger]}
              onPress={() => remove(item.roomId)}
            >
              <Text style={s.btnDangerText}>ลบ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (!user) {
    return (
      <View style={[s.container, s.empty]}>
        <FontAwesome name="shopping-bag" size={22} />
        <Text style={{ marginTop: 6 }}>กรุณาเข้าสู่ระบบเพื่อดูตะกร้า</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[s.container, s.empty]}>
        <ActivityIndicator />
      </View>
    );
  }

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
            keyExtractor={(it) => it.cartId}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />

          <View style={s.footer}>
            <View style={{ flex: 1 }}>
              <Text style={s.totalLabel}>ยอดรวมทั้งหมด</Text>
              <Text style={s.totalValue}>฿{grand.toLocaleString()}</Text>
            </View>

            <TouchableOpacity
              style={[s.btn, s.btnDanger, { marginRight: 8 }]}
              onPress={clear}
            >
              <Text style={s.btnDangerText}>ลบทั้งหมด</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={() => { }}>
              <Text style={s.btnPrimaryText}>ชำระเงิน</Text>
            </TouchableOpacity>
          </View>
        </>
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
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnGhost: { backgroundColor: "#E5EDFF" },
  btnGhostText: { fontWeight: "800", color: "#1E3A8A" },
  btnPrimary: { backgroundColor: "#1D4ED8" },
  btnPrimaryText: { fontWeight: "800", color: "#fff" },
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
});

