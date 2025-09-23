// ButtonGroup.tsx
import { colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import { useCart } from "../../../src/store/useCart";

// ✅ Firebase
import { auth, db } from "@/constants/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

type Props = {
  roomId: string;
  idUser?: string;
  nameHotel?: string;
  nameFull?: string;
  address?: string;
  price?: number;
  url?: string;
  dateCheck?: string;
  dateOut?: string;
  dayCount?: number;
};

const ButtonGroup = (props: Props) => {
  const { roomId } = props;

  const addLocal = useCart((s) => s.add);
  const localExists = useCart((s) => s.items.some((it) => it.roomId === roomId));

  const [snack, setSnack] = useState(false);
  const [snackText, setSnackText] = useState("เพิ่มลงตะกร้าแล้ว");
  const [posting, setPosting] = useState(false);

  const reserve = () => {
    if (!roomId) return;
    router.replace({
      pathname: "/(app)/(tabs)/bookroom",
      params: { roomId },
    });
  };

  const addItemToCart = async () => {
    try {
      if (!roomId) return;

      const user = auth.currentUser;
      if (!user) {
        setSnackText("กรุณาเข้าสู่ระบบก่อน");
        setSnack(true);
        return;
      }

      if (posting) return; // prevent double-tap
      setPosting(true);

      // 1) Verify room exists and is available (room_status == 1)
      const roomRef = doc(db, "rooms", roomId);
      const roomSnap = await getDoc(roomRef);
      if (!roomSnap.exists()) {
        setSnackText("ไม่พบข้อมูลห้อง");
        setSnack(true);
        return;
      }
      const room = roomSnap.data() as any;
      if (Number(room?.room_status ?? 0) !== 1) {
        setSnackText("ห้องนี้ถูกจองแล้ว / ไม่ว่าง");
        setSnack(true);
        return;
      }

      // 2) Prevent duplicate in Firestore (same user_id + room_id)
      const cartsRef = collection(db, "carts");
      const dupQ = query(
        cartsRef,
        where("user_id", "==", user.uid),
        where("room_id", "==", roomId),
        limit(1)
      );
      const dupSnap = await getDocs(dupQ);
      if (!dupSnap.empty) {
        setSnackText("มีห้องนี้ในตะกร้าแล้ว");
        setSnack(true);
        return;
      }

      // 3) Create cart doc
      await addDoc(cartsRef, {
        user_id: user.uid,
        room_id: roomId,
        createdAt: serverTimestamp(),
      });

      // 4) Also add to local Zustand cart (UI feels instant)
      if (!localExists) {
        addLocal({
          roomId: props.roomId,
          idUser: props.idUser ?? "",
          nameHotel: props.nameHotel ?? "",
          nameFull: props.nameFull ?? "",
          address: props.address ?? "",
          price: Number(props.price ?? 0),
          url: props.url ?? "",
          dateCheck: props.dateCheck ?? "",
          dateOut: props.dateOut ?? "",
          dayCount: Number(props.dayCount ?? 0),
        });
      }

      setSnackText("เพิ่มลงตะกร้าแล้ว");
      setSnack(true);
    } catch (err: any) {
      console.error("Add to cart error:", err);
      setSnackText("เกิดข้อผิดพลาดในการเพิ่มตะกร้า");
      setSnack(true);
    } finally {
      setPosting(false);
    }
  };

  return (
    <View style={styles.buttonGroup}>
      <Button
        contentStyle={{ width: 156 }}
        mode="contained"
        onPress={reserve}
        labelStyle={{ fontSize: 25, fontWeight: "700" }}
        buttonColor={colors.secondary}
      >
        จอง
      </Button>

      <Button
        contentStyle={{ width: 76 }}
        mode="outlined"
        onPress={addItemToCart}
        labelStyle={{ fontSize: 10 }}
        disabled={posting} // disable while processing (and let Firestore dedupe)
      >
        <FontAwesome name="shopping-cart" size={20} />
      </Button>

      <Snackbar
        visible={snack}
        onDismiss={() => setSnack(false)}
        duration={1500}
        style={styles.snack}
      >
        <View style={styles.snackRow}>
          <FontAwesome name="check-circle" size={18} color="#16A34A" />
          <Text style={styles.snackText}>{snackText}</Text>
        </View>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "100%",
    display: "flex",
    gap: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    paddingEnd: 20,
  },
  snack: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
  },
  snackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  snackText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 14,
  },
});

export default ButtonGroup;
