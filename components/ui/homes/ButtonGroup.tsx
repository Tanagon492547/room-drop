// ในไฟล์ ButtonGroup.tsx

import { useCart } from "@/app/UseCart"; // สมมติว่า path ถูกต้อง
import { colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Snackbar } from "react-native-paper";

// ✨ 1. กำหนด Props ให้ชัดเจนและครบถ้วน
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
  const { roomId, nameHotel } = props; // ดึง roomId มาใช้เพื่อความกระชับ
  const add = useCart((s) => s.add);
  const exists = useCart((s) => s.items.some((it) => it.roomId === roomId));
  const [snack, setSnack] = useState(false);

  // ✨ 2. แก้ไขฟังก์ชัน reserve ให้ถูกต้อง
  const reserve = () => {
    if (!roomId) return;
    console.log("จองห้องหมายเลข", roomId);
    router.replace({
      pathname: '/(app)/(tabs)/bookroom',
      params: { 
        roomId: roomId,
       }, // ใช้ roomId ที่รับมาจาก props
    });
  };

  // ✨ 3. แก้ไขฟังก์ชัน addItemToCart ให้ถูกต้อง
  const addItemToCart = () => {
    if (!roomId || exists) return;

    add({
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

    setSnack(true); // แสดง Snackbar เมื่อเพิ่มสำเร็จ
  };

  return (
    <View style={styles.buttonGroup}>
      <Button
        contentStyle={{ width: 156 }}
        mode="contained"
        onPress={reserve} // ✨ 4. ใช้ onPress อย่างเดียว
        labelStyle={{ fontSize: 25, fontWeight: "700" }}
        buttonColor={colors.secondary}
      >
        จอง
      </Button>

      <Button
        contentStyle={{ width: 76 }}
        mode="outlined"
        onPress={addItemToCart} // ✨ 4. ใช้ onPress อย่างเดียว
        labelStyle={{ fontSize: 10 }}
        disabled={exists} // ปิดปุ่มถ้ามีในตะกร้าแล้ว
      >
        <FontAwesome name="shopping-cart" size={20} />
      </Button>

      {/* Snackbar สำหรับแจ้งเตือน */}
      <Snackbar
        visible={snack}
        onDismiss={() => setSnack(false)}
        duration={1500}
        style={styles.snack}
      >
        <View style={styles.snackRow}>
          <FontAwesome name="check-circle" size={18} color="#16A34A" />
          <Text style={styles.snackText}>เพิ่มลงตะกร้าแล้ว</Text>
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
    gap: 8 
  },
  snackText: { 
    color: "#111827", 
    fontWeight: "700", 
    fontSize: 14 
  },
});

export default ButtonGroup;
