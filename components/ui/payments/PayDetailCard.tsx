import { colors } from "@/constants/Colors";
import { Platform, StyleSheet, Text, View } from "react-native";
import LineBox from "../homes/LineBox";

type props = {
  name?: string,
  phoneNumber?: string,
  roomId?: string,
  nameHotel?: string,
}

const PayDetailCard = ({ name, phoneNumber, roomId, nameHotel }: props) => {
  return (
    <View style={[styles.card,styles.shadow]}>
      <Text style={[styles.position, styles.h1]}>รายละเอียดการจอง</Text>
      <View style={styles.textBox}>
        <Text style={styles.p}>ชื่อ</Text>
        <Text style={styles.p2}>{name}</Text>
      </View>
      <LineBox />
      <View style={styles.textBox}>
        <Text style={styles.p}>หมายเลขโทรศัพท์</Text>
        <Text style={styles.p2}>{phoneNumber}</Text>
      </View>
      <LineBox />
      <View style={styles.textBox}>
        <Text style={styles.p}>โรงเเรม</Text>
        <Text style={styles.p2}>{nameHotel}</Text>
      </View>
      <LineBox />
      <View style={styles.textBox}>
        <Text style={styles.p}>รหัสสินค้า</Text>
        <Text style={styles.p2}>{roomId}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 328,
    position: 'relative',
    backgroundColor: colors.background,
    borderRadius: 12, padding: 10,
    marginBlock: 58,
    marginHorizontal: 10,
  },
  position: { position: 'absolute', top: -25, left: 12 },
  h1:{
    fontSize:25,
    fontWeight:'bold',
    color: colors.text,
    opacity:0.8
  },
  p: {
    fontSize:15,
    fontWeight:'bold',
    color: colors.text,
    opacity:0.7
  },
  p2:{
    fontSize:15,
    fontWeight:'300',
    color: colors.text,
    opacity:0.6
  },
  textBox: { flexDirection: 'row', justifyContent: 'space-between', marginTop:10 },
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

export default PayDetailCard;