import { View } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text } from "react-native";
import ButtonGroup from "./ButtonGroup";
import ImgCard from "./ImgCard";
import LineBox from "./LineBox";

// ✨ 1. ทำให้ Props ชัดเจนและยืดหยุ่นขึ้น
type Props = {
  nameHotel?: string;
  nameFull?: string;
  idUser?: string;
  address?: string;
  price?: number;
  url?: string;
  dateCheck?: string;
  dateOut?: string;
  roomId?: string; // ใช้ roomId เป็นหลักสำหรับ ID
  dayCount?: number;
};

const ContainerCard = (props: Props) => {
  // ✨ 2. เตรียมข้อมูลที่จะใช้แสดงผลและส่งต่อให้พร้อม
  // ใช้ Nullish Coalescing Operator (??) เพื่อกำหนดค่า default ที่ดี
  const displayData = {
    roomId: props.roomId ?? "unknown-id",
    idUser: props.idUser ?? "unknown-user",
    nameHotel: props.nameHotel ?? "ไม่มีข้อมูลโรงแรม",
    nameFull: props.nameFull ?? "ไม่มีข้อมูลผู้ปล่อย",
    address: props.address ?? "ไม่มีข้อมูลที่อยู่",
    price: props.price ?? 0,
    url: props.url ?? "",
    dateCheck: props.dateCheck ?? "--/--/----",
    dateOut: props.dateOut ?? "--/--/----",
    dayCount: props.dayCount ?? 0,
  };

  return (
    <View style={styles.container}>
      <View style={[styles.cardBody, styles.shadow]}>
        {/* ✨ 3. ส่ง props ที่จำเป็นไปให้ ImgCard */}
        <ImgCard
          url={displayData.url}
          dayCount={displayData.dayCount}
          roomId={displayData.roomId}
          nameHotel={displayData.nameHotel}
        />

        <View style={styles.textCrad}>
          <View style={styles.detailCard}>
            <Text style={styles.h1} numberOfLines={1}
              ellipsizeMode="tail">{displayData.nameHotel}</Text>
            <Text numberOfLines={1}
              ellipsizeMode="tail">{displayData.nameFull}</Text>
            <Text>ผู้ปล่อยห้อง</Text>
            <Text style={styles.p} numberOfLines={1}
              ellipsizeMode="tail">{displayData.address}</Text>
            <Text style={styles.h2} numberOfLines={1}
              ellipsizeMode="tail">ราคา : ฿{displayData.price.toLocaleString()}</Text>
          </View>

          <View style={styles.calendarContainer}>
            <View style={styles.iconCalendar}>
              <FontAwesome name="calendar-check-o" size={30} />
              <Text style={styles.p2}>{displayData.dateCheck}</Text>
            </View>
            <View style={styles.iconCalendar}>
              <FontAwesome name="calendar-times-o" size={30} />
              <Text style={styles.p2}>{displayData.dateOut}</Text>
            </View>
          </View>
        </View>

        <LineBox />

        {/* ✨ 4. ส่งข้อมูลทั้งหมดไปให้ ButtonGroup */}
        <ButtonGroup {...displayData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  cardBody: {
    width: "100%",
    backgroundColor: "white",
    minHeight: 380,
    borderRadius: 20,
    paddingBottom: 20,
  },
  textCrad: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15, // เพิ่ม padding ให้สวยงาม
    marginTop: 10, // เพิ่มระยะห่างจากรูป
    backgroundColor: 'transparent'
  },
  detailCard: {
    gap: 5,
    flex: 1, // ทำให้ข้อความตัดบรรทัดเมื่อยาวเกินไป
    backgroundColor: 'transparent'
  },
  calendarContainer: { // สร้าง style ใหม่สำหรับส่วนปฏิทิน
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginLeft: 10, // เพิ่มระยะห่างซ้าย
    backgroundColor: 'transparent'
  },
  iconCalendar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: 'transparent'
  },
  h1: { fontSize: 25, fontWeight: "700" },
  h2: { fontSize: 20, fontWeight: "800", paddingTop: 10 },
  p: { fontSize: 10, fontWeight: "bold", color: 'grey' },
  p2: { fontSize: 12, fontWeight: "800", backgroundColor: 'transparent' },
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
});

export default ContainerCard;