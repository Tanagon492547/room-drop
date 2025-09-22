import BillCard from "@/components/ui/bills/BillCard";
import DropImageCard from "@/components/ui/DropImageCard";
import { colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const BillPaymentScreen = () => {
  const params = useLocalSearchParams();
  const finalRoomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const [howPay, setHowPay] = useState('PromptPay'); // วิธีชำระ
  const [price, setPrice] = useState(99999);
  const [nameHotel, setNameHotl] = useState('Goodhotel888'); // ชื่อฌรงเเรม
  const [userName, setUserName] = useState('ชื่อเจ้าของบัญชีใส่ตรงนี้'); // ชื่อฌรงเเรม
  const [roomDetail, setRoomDetail] = useState('ห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผีห้องนี้มีผี');
  const [url, setUrl] = useState('');
  const [address, setAddress] = useState('36/55/ ถ. สขุมวิท เเสงพรพร ซอยตัน 5 กรุงเทพ')
  const [dateCount, setDateCount] = useState('1')
  const [inCheck, setInCheck] = useState('16 ธันวาคม 2025');
  const [outCheck, setOutCheck] = useState('17 ธันวาคม 2025');
  const [inTime, setInTime] = useState('14.00 น.')
  const [outTime, setOutTime] = useState('14.00 น.')
  return (
    <View style={styles.container}>
      <View style={styles.img}>
        <DropImageCard url={url} width={395} height={214} />
      </View>
      <ScrollView>
        <View style={styles.card}>
          <BillCard
            finalRoomId={finalRoomId}
            howPay={howPay} price={price}
            nameHotel={nameHotel}
            userName={userName}
            roomDetail={roomDetail}
            address={address}
            dateCount={dateCount}
            inCheck={inCheck}
            outCheck={outCheck}
            inTime={inTime}
            outTime={outTime}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBlockEnd:20,
    position:'relative'
  },
  img:{
    marginBottom:-100
  },
  card: {
    width: 328,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    marginBlockEnd:20,
  },

})

export default BillPaymentScreen;