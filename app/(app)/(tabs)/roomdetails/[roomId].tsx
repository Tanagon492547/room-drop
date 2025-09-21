import ButtonGroup from "@/components/ui/homes/ButtonGroup";
import HotelDDetailCard from "@/components/ui/hoteldetails/HotelDDetailCard";
import RoomDetailCard from "@/components/ui/roomdetails/RoomDetailCard";
import TitleText from "@/components/ui/TitleText";
import { colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

const RoomDetail = () => {
  const params = useLocalSearchParams();
  const hotelTitle = Array.isArray(params.nameHotel) ? params.nameHotel[0] : params.nameHotel;
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const [url, setUrrl] = useState('');
  const [adddress, setAddres] = useState('กรุงเทพสุดโหด') // ที่อยู่โรงเเรมที่นี่
  const [hotelDetail, setDetail] = useState('เป็นโรงแรมสุดหรูที่ตั้งอยู่แถวใจกลางเมืองกรุงเทพ เดือนทางไปมาได้อย่างสะดวกสบาย') //รายละเอียดที่นี่
  const [roomStatus, setRoomStatus] = useState(true); // ห้องยังขายอยู่้ไหม หรือเลยวันเช็คอินไปเเล้ว
  const [roomDetail, setroomDetail] = useState('1 ห้องนอน 1 ห้องน้ำส่วนตัว บริการที่มี สบู่ น้ำยาสระผม เเละผ้าเช็ดตัว ฟักบัว เเอร์')
  const [bedType,  setBedType] = useState('Double Deluxe')

  return (
    <View style={styles.container}>
      <TitleText hotelTitle={hotelTitle} />
      <ScrollView style={[styles.card, styles.shadow]}>
        {/* ส่วนราายละเอียดโรงเเรม */}
        <HotelDDetailCard url={url} hotelTitle={hotelTitle} address={adddress} hotelDetail={hotelDetail} />
        <View style={styles.roomStatus}>
          <Text style={styles.h1}>{roomStatus ? 'ห้องว่าง' : 'ห้องไม่ว่าง'}</Text>
        </View>

        <RoomDetailCard roomDetail={roomDetail} bedType={bedType} />
      </ScrollView>
      <View style={styles.fileBox}>
        <ButtonGroup roomId={roomId ? roomId : ''} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center'
  },
  fileBox: {
    paddingBlock: 20
  },
  card: {
    width: 373,
    backgroundColor: 'white',
    borderRadius: 20
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
  roomStatus: {
    width: '100%',
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingBlock: 5
  },
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textBlue,
  }
});

export default RoomDetail;