import ButtonGroup from "@/components/ui/homes/ButtonGroup";
import HotelDDetailCard from "@/components/ui/hoteldetails/HotelDDetailCard";
import RoomDetailCard from "@/components/ui/roomdetails/RoomDetailCard";
import TitleText from "@/components/ui/TitleText";
import { colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

const RoomDetail = () => {
  // --- 1. ดึงข้อมูลหลักจาก URL ---
  const params = useLocalSearchParams();
  // แปลงค่าให้เป็น string เสมอ ป้องกัน Type Error
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const hotelTitle = Array.isArray(params.nameHotel) ? params.nameHotel[0] : params.nameHotel;

  // --- 2. ข้อมูลจำลอง (ที่จะดึงมาจากฐานข้อมูลโดยใช้ roomId ในอนาคต) ---
  const [url, setUrl] = useState('https://picsum.photos/seed/123/3000/2000'); // ใส่ URL เริ่มต้น
  const [address, setAddress] = useState('กรุงเทพสุดโหด');
  const [hotelDetail, setDetail] = useState('เป็นโรงแรมสุดหรู...');
  const [roomStatus, setRoomStatus] = useState(true);
  const [roomDetail, setRoomDetail] = useState('1 ห้องนอน 1 ห้องน้ำ...');
  const [bedType, setBedType] = useState('Double Deluxe');

  // ✨ ไม่จำเป็นต้องมี displayData ที่ซับซ้อนแล้ว เราจะส่ง props โดยตรง

  return (
    <View style={styles.container}>
      {/* ✨ 3. ส่ง props ที่ถูกต้องเข้าไป */}
      <TitleText hotelTitle={hotelTitle} />
      
      <ScrollView style={[styles.card, styles.shadow]}>
        <HotelDDetailCard 
          url={url} 
          hotelTitle={hotelTitle} 
          address={address} 
          hotelDetail={hotelDetail} 
        />
        
        <View style={styles.roomStatus}>
          <Text style={styles.h1}>{roomStatus ? 'ห้องว่าง' : 'ห้องไม่ว่าง'}</Text>
        </View>

        <RoomDetailCard roomDetail={roomDetail} bedType={bedType} />
      </ScrollView>

      <View style={styles.fileBox}>
        <ButtonGroup roomId={roomId} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  // ... styles ของเอเธนส์ถูกต้องดีแล้ว ...
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center'
  },
  fileBox: {
    paddingVertical: 20, // ✨ (แนะนำ) ใช้ paddingVertical แทน paddingBlock
    width: '100%',
    alignItems: 'center', // จัดให้ปุ่มอยู่กลาง
  },
  card: {
    width: '95%', // ✨ (แนะนำ) ใช้ % เพื่อให้ responsive
    backgroundColor: 'white',
    borderRadius: 20
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
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
    paddingVertical: 5, // ✨ (แนะนำ) ใช้ paddingVertical แทน paddingBlock
  },
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textBlue,
  }
});

export default RoomDetail;