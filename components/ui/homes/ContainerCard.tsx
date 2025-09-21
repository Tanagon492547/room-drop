import { View } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text } from "react-native";
import ButtonGroup from "./ButtonGroup";
import ImgCard from "./ImgCard";
import LineBox from "./LineBox";

type Props = {
  nameHotel?: string;
  nameFull?: string;
  idUser?: string;
  address?: string;
  price?: number;
  url?: string;        // ลิงก์รูป
  dateCheck?: string;
  dateOut?: string;
  idItem?: string;     // หมายเลขไอดีห้อง
  dayCount?: number;   // ตัวเลขไว้โชว์อย่างเดียว
};

//  ถ้ามี type CartItem ใน UseCart ให้ import มาใช้แทนด้านล่างนี้ได้
type CartItem = {
  idItem: string;
  idUser: string;
  nameHotel: string;
  nameFull: string;
  address: string;
  price: number;
  url: string;
  dateCheck: string;
  dateOut: string;
  dayCount: number;
};

const ContainerCard = ({
  nameHotel,
  nameFull,
  idUser,
  address,
  price,
  url,
  dateCheck,
  dateOut,
  idItem,
  dayCount,
}: Props) => {
  // payload สำหรับตะกร้า (normalize ตัวเลขให้แน่ใจเป็น number)
  const itemForCart: CartItem = {
    idItem: idItem ?? "unknown-id",
    idUser: idUser ?? "unknown-user",
    nameHotel: nameHotel ?? "ไม่มีข้อมูล",
    nameFull: nameFull ?? "ไม่มีข้อมูล",
    address: address ?? "ไม่มีข้อมูล",
    price: Number(price ?? 0),
    url: url ?? "",
    dateCheck: dateCheck ?? "ไม่มีข้อมูล",
    dateOut: dateOut ?? "ไม่มีข้อมูล",
    dayCount: Number(dayCount ?? 0),
  };

  return (
    <View style={styles.container}>
      <View style={[styles.cardBody, styles.shadow]}>
        <ImgCard url={itemForCart.url} dayCount={itemForCart.dayCount} />

        <View style={styles.textCrad}>
          <View style={styles.detailCard}>
            <Text style={styles.h1}>{itemForCart.nameHotel}</Text>
            <Text>{itemForCart.nameFull}</Text>
            <Text>ผู้ปล่อยห้อง</Text>
            <Text style={styles.p}>{itemForCart.address}</Text>
            <Text style={styles.h2}>ราคา : ฿{itemForCart.price.toLocaleString()}</Text>
          </View>

          <View
            style={{
              backgroundColor: "transparent",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <View style={styles.iconCalendar}>
              <FontAwesome name="calendar-check-o" size={30} />
              <Text style={styles.p2}>{itemForCart.dateCheck}</Text>
            </View>
            <View style={styles.iconCalendar}>
              <FontAwesome name="calendar-times-o" size={30} />
              <Text style={styles.p2}>{itemForCart.dateOut}</Text>
            </View>
          </View>
        </View>

        <LineBox />

        {/* ส่ง payload เต็มไปที่ปุ่ม (รองรับ add-to-cart + snackbar) */}
        <ButtonGroup
          idItem={itemForCart.idItem}
          idUser={itemForCart.idUser}
          nameHotel={itemForCart.nameHotel}
          nameFull={itemForCart.nameFull}
          address={itemForCart.address}
          price={itemForCart.price}
          url={itemForCart.url}
          dateCheck={itemForCart.dateCheck}
          dateOut={itemForCart.dateOut}
          dayCount={itemForCart.dayCount}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    display: "flex",
    alignItems: "center",
    paddingBlock: 20,
    backgroundColor: "transparent",
  },
  cardBody: {
    width: "100%",
    padding: 1,
    backgroundColor: "white",
    minHeight: 380,
    borderRadius: 20,
    display: "flex",
    paddingBottom: 20,
  },
  h1: { fontSize: 30, fontWeight: "700" },
  h2: { fontSize: 20, fontWeight: "800", paddingTop: 10 },
  h3: { fontSize: 20, color: "red", fontWeight: "700" },
  p: { fontSize: 10, fontWeight: "bold" },
  p2: { fontSize: 12, fontWeight: "800" },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: { elevation: 10 },
    }),
  },
  buttonPressed: { opacity: 0.8 },
  buttonHovered: { backgroundColor: "#6495ED" },
  textCrad: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    paddingHorizontal: 5,
  },
  detailCard: {
    backgroundColor: "transparent",
    alignContent: "center",
    display: "flex",
    gap: 5,
  },
  iconCalendar: {
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});

export default ContainerCard;
