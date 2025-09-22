import { View } from "@/components/Themed";
import { colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Platform, StyleSheet, Text } from "react-native";
import { List } from "react-native-paper";
import LineBox from "../homes/LineBox";

type props = {
  finalRoomId?: string,
  howPay?: string,
  price?: number,
  nameHotel?: string,
  userName?: string,
  roomDetail?: string,
  address?: string,
  dateCount?: string,
  inCheck?: string,
  outCheck?: string,
  inTime?: string,
  outTime?: string
}

const BillCard = ({ finalRoomId, howPay, price, nameHotel, userName, roomDetail, address, dateCount, inCheck, inTime, outCheck, outTime }: props) => {
  return (

    <View style={styles.card}>
      <Text style={styles.h1}>รายละเอียดการจอง</Text>
      <View style={styles.billDetail}>
        <Text style={styles.p}>หมายเลขการจอง</Text>
        <Text style={[styles.p, styles.opacity]}>{finalRoomId}</Text>
      </View>
      <View style={styles.billDetail}>
        <Text style={[styles.p]}>ทำการจอง เเละชำระโดย {howPay}</Text>
        <Text style={[styles.p, styles.opacity]}>{price}</Text>
      </View>

      <LineBox />

      <View style={styles.billDetail}>
        <Text style={[styles.h1, styles.opacity]}>{nameHotel}</Text>
      </View>

      <LineBox />

      <View style={styles.billDetail}>
        <Text style={[styles.p, styles.opacity]}>{userName}</Text>
      </View>
      <LineBox />
      <List.Section style={styles.accordionGroup}>
        {/* Accordion ตัวที่ 1 */}
        <List.Accordion
          title="รายละเอียดห้องพัก"
          titleStyle={styles.title}
          style={styles.accordion}

        >
          <View style={styles.content}>
            <Text style={[styles.p, styles.opacity, styles.contentText]}>
              {nameHotel} :
              {roomDetail}
            </Text>
          </View>
        </List.Accordion>
      </List.Section>
      <LineBox />
      <View style={styles.map}>
        <View style={[styles.mapDetail, styles.shadow]}>
          <View style={[styles.mapCardIn, styles.mapColor]}>
            <FontAwesome name="map-marker" size={20} color='red' />
          </View>
          <View style={[styles.mapCardIn]}>
            <Text style={[styles.p, styles.opacity, { backgroundColor: 'transparent', }]}>
              {address}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.dateDetali}>
        <View>
          <Text style={[styles.p2, styles.opacity]}>เช็คอิน</Text>
          <Text style={[styles.p2, styles.opacity]}>{inCheck}</Text>
          <Text style={[styles.p2, styles.opacity]}>{inTime}</Text>
        </View>
        <View>
          <Text style={[styles.p2, styles.opacity]}>
            {dateCount} คืน
          </Text>
        </View>
        <View>
          <Text style={[styles.p2, styles.opacity]}>เช็คเอาต์</Text>
          <Text style={[styles.p2, styles.opacity]}>{outCheck}</Text>
          <Text style={[styles.p2, styles.opacity]}>{outTime}</Text>
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  card: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBlock: 15,
    borderRadius: 20,

  },
  billDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  accordionGroup: {
    borderColor: '#e5e7eb', // สีเทาอ่อนเหมือน base-300
    backgroundColor: '#ffffff', // สีขาวเหมือน base-100
    width: '100%'
  },
  accordion: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 16,
    fontWeight: '600', // semi-bold
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contentText: {
    fontSize: 14, // text-sm
  },
  map: {
    width: '100%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapDetail: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  mapCardIn: {

    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    backgroundColor: 'transparent',
  },
  mapColor: {
    backgroundColor: colors.textLight,
  },
  dateDetali: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  h1: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.text,
    opacity: 1,
    marginHorizontal:10
  },
  p: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal:10
  },
  p2: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal:10
  },
  opacity: {
    opacity: 0.6,
  },
  shadow: {
    ...Platform
      .select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
        },
        android: {
          elevation: 4,
        },
      }),
  },
})

export default BillCard;