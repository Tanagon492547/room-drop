import PayDetailCard from "@/components/ui/payments/PayDetailCard";
import PaySelectCard from "@/components/ui/payments/PaySelectCard";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const PaymentScreen = () => {
  const params = useLocalSearchParams();
  const finalRoomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const [name, setName] = useState('ไม่บอก หรอก');
  const [phoneNumber, setPhoneNumber] = useState('0000000');
  const [nameHotel, setNameHotel] = useState('ใส่ชื่อโรงเเรมที่นี่')
  return (
    <ScrollView>
      <View style={styles.card}>
        <PayDetailCard name={name} phoneNumber={phoneNumber} nameHotel={nameHotel} roomId={finalRoomId} />

        <PaySelectCard roomId={finalRoomId} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  card: { 
    width: '100%', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap:10
  }
})

export default PaymentScreen;