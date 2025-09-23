import { View } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import { Platform, StyleSheet, Text } from "react-native";
import ButtonGroup from "./ButtonGroup";
import ImgCard from "./ImgCard";
import LineBox from "./LineBox";

type RoomListItem = {
  room_id: string;
  hotel_id?: string;
  user_id?: string;
  hotel_name?: string;
  hotel_location?: string;
  room_date_checkIn?: string;
  room_date_checkOut?: string;
  room_price?: number;
  room_photoURL?: string;
  hotel_photoURL?: string;
  seller_name?: string;
  url?: string; 
  dayCount?: number;
};

const ContainerCard = ({
  hotel_name,
  seller_name,
  user_id,
  hotel_location,
  room_price,
  url,
  room_date_checkIn,
  room_date_checkOut,
  room_id,
  dayCount,
}: RoomListItem) => {
  return (
    <View style={styles.container}>
      <View style={[styles.cardBody, styles.shadow]}>
        <ImgCard url={url} dayCount={dayCount} roomId={room_id} nameHotel={hotel_name} />

        <View style={styles.textCrad}>
          <View style={styles.detailCard}>
            <Text style={styles.h1}>{hotel_name ?? "ไม่มีข้อมูล"}</Text>
            <Text>{seller_name ?? "ไม่มีข้อมูล"}</Text>
            <Text>ผู้ปล่อยห้อง</Text>
            <Text style={styles.p}>{hotel_location ?? "ไม่มีข้อมูล"}</Text>
            <Text style={styles.h2}>
              ราคา : {typeof room_price === "number" ? room_price : "ไม่มีข้อมูล"}
            </Text>
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
              <Text style={styles.p2}>{room_date_checkIn ?? "ไม่มีข้อมูล"} </Text>
            </View>
            <View style={styles.iconCalendar}>
              <FontAwesome name="calendar-times-o" size={30} />
              <Text style={styles.p2}>{room_date_checkOut ?? "ไม่มีข้อมูล"}</Text>
            </View>
          </View>
        </View>

        <LineBox />

        {/*In ContainerCard.tsx*/}
        <ButtonGroup
          roomId={room_id ?? ""}
          idUser={user_id}
          nameHotel={hotel_name}
          nameFull={seller_name}
          address={hotel_location}
          price={room_price}
          url={url} // the resolved https URL you already pass to ImgCard
          dateCheck={room_date_checkIn}
          dateOut={room_date_checkOut}
          dayCount={dayCount}
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
  h1: {
    fontSize: 30,
    fontWeight: "700",
  },
  h2: {
    fontSize: 20,
    fontWeight: "800",
    paddingTop: 10,
  },
  p: {
    fontSize: 10,
    fontWeight: "bold",
  },
  p2: {
    fontSize: 12,
    fontWeight: "800",
  },
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
