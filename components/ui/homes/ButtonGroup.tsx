import { useCart } from "@/app/UseCart";
import { View } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { View as RNView, StyleSheet, Text } from "react-native";
import { Button, Snackbar } from "react-native-paper";

type Props = {
  idItem: string;
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

const ButtonGroup = ({
  idItem,
  idUser,
  nameHotel,
  nameFull,
  address,
  price,
  url,
  dateCheck,
  dateOut,
  dayCount,
}: Props) => {
  const add = useCart((s) => s.add);
  const exists = useCart((s) => s.items.some((it) => it.idItem === idItem));
  const [snack, setSnack] = useState(false);

  const reserve = () => {
    if (!idItem) return;
    // TODO: flow จองจริงที่นี่
    console.log("จองห้องหมายเลข", idItem);
  };

  const addItemToCart = () => {
    if (!idItem || exists) return;

    add({
      idItem,
      idUser: idUser ?? "",
      nameHotel: nameHotel ?? "",
      nameFull: nameFull ?? "",
      address: address ?? "",
      price: Number(price ?? 0),
      url: url ?? "",
      dateCheck: dateCheck ?? "",
      dateOut: dateOut ?? "",
      dayCount: Number(dayCount ?? 0),
    });

    setSnack(true);
  };

  return (
    <View style={styles.buttonGroup}>
      <Button
        contentStyle={{ width: 156 }}
        mode="contained"
        labelStyle={{ fontSize: 18, fontWeight: "700" }}
        onPress={reserve}
      >
        จอง
      </Button>

      <Button
        contentStyle={{ width: 76 }}
        mode="outlined"
        labelStyle={{ fontSize: 10 }}
        onPress={addItemToCart}
        disabled={exists}
      >
        <FontAwesome name="shopping-cart" size={20} />
      </Button>

      {/* Snackbar */}
      <Snackbar
        visible={snack}
        onDismiss={() => setSnack(false)}
        duration={1500}
        style={styles.snack}
        wrapperStyle={styles.snackWrapper}
        elevation={0}
        theme={{ colors: { surface: "#FFFFFF", onSurface: "#111827" } }}
      >
        <RNView style={styles.snackRow}>
          <FontAwesome name="check-circle" size={18} color="#16A34A" />
          <Text style={styles.snackText}>เพิ่มลงตะกร้าแล้ว</Text>
        </RNView>
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
  snackWrapper: { backgroundColor: "transparent", bottom: 12 },
  snack: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    shadowColor: "transparent",
  },
  snackRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  snackText: { color: "#111827", fontWeight: "700", fontSize: 14 },
});

export default ButtonGroup;
