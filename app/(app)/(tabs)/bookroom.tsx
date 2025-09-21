import BookingForCard from "@/components/ui/bookingscreens/BookingForCard";
import BookingFormCard from "@/components/ui/bookingscreens/BookingFormCard";
import DateDeatil from "@/components/ui/bookingscreens/DateDeaatil";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const BookRoom = () => {
  const [checkInDate, setCheckInDate] = useState('dateCheckIn')
  const [checkOutDate, setCheckOutDate] = useState('dateCheckOut')
  const [dayCount, setDayCount] = useState(1)
  const [url, setUrl] = useState('')
  const [hotelTitle, setHotelTitle] = useState('Goodhotel888')
  const [province, setญrovince] = useState('กรุงเทพ')
  const [roomDetail, setroomDetail] = useState('1 ห้องนอน 1 ห้องน้ำส่วนตัว บริการที่มี สบู่ น้ำยาสระผม เเละผ้าเช็ดตัว ฟักบัว เเอร์')
  const [address, setAddres] = useState(' ตลาดกรุงเทพ ประตูน้ำ')
  const [userFName, setUserFName] = useState('จงจริง')
  const [userLName, setUserLName] = useState('จริงจัง')
  const [email, setEmail] = useState('GGG@gmail.com')
  const [phoneNnumber, setPhoneNnumber] = useState('0991244678')

  return (
    <ScrollView>
      <View style={styles.container}>
      <DateDeatil checkInDate={checkInDate} checkOutDate={checkOutDate} dayCount={dayCount} />

      <BookingForCard url={url} hotelTitle={hotelTitle} province={province} roomDetail={roomDetail} address={address} />
      
      {/* กรอกฟอร์มอยู่ในนี้ */}
      <BookingFormCard  fname={userFName} lname={userLName} email={email} phone_number={phoneNnumber} />
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap:20
  }
})

export default BookRoom;