import { colors } from "@/constants/Colors";
import { Platform, StyleSheet, Text, View } from "react-native";
import DropImageCard from "../DropImageCard";

type props = {
  url?: string,
  hotelTitle?: string,
  province?: string,
  roomDetail?: string,
  address?: string
}

const BookingForCard = ({ url, hotelTitle, province, roomDetail, address }: props) => {
  return (
    <View style={[styles.card, styles.shadow]}>
      <View style={{ flex: 1, flexShrink: 1, }}>
        <DropImageCard url={url} width={161} height={88} />

        <Text style={styles.h1}>{hotelTitle}</Text>
        <Text style={styles.h2}>{province}</Text>
      </View>
      <View style={{ flex: 1, flexShrink: 1, justifyContent: 'space-between' }}>
        <Text style={[styles.p, styles.b]}>รายละเอียด</Text>
        <Text style={styles.p}>{roomDetail}</Text>

        <Text style={[styles.p, styles.b]}>ที่อยู่</Text>
        <Text style={styles.p}>{address}</Text>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 15
        }}></View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 364,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBlock: 23,
    paddingHorizontal: 21,
    backgroundColor: colors.background,
    borderRadius: 10,
    gap: 50,
    borderWidth: 1
  },
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    opacity: 1
  },
  h2: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    opacity: 0.6
  },
  p: {
    fontSize: 12,
    color: colors.text,
    opacity: 1
  },
  b: {
    fontWeight: 'bold',
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

export default BookingForCard;