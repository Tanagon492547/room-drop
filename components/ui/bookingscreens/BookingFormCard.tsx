import { colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

type props = {
  fname?: string,
  lname?: string,
  email?: string,
  phone_number?: string
}

const BookingFormCard = ({ fname, lname, email, phone_number }: props) => {
   const params = useLocalSearchParams();
   const roomId = params.roomId === null ? undefined : params.roomId;
  const [userFName, setUserFName] = useState(fname || '')
  const [userLName, setUserLName] = useState(lname || '')
  const [userEmail, setUserEmail] = useState(email || '')
  const [phoneNnumber, setPhoneNnumber] = useState(phone_number || '')
  const [country, setCountry] = useState('ไทย') // ใส่มาเท่ๆ

  // มาส่งข้อมูลการจองที่นนี่เเล้ววิ่งไปหาหน้าจ่ายเงิน
  const formSending =()=>{
     console.log('จองห้อง', roomId)

     router.replace({
      pathname:'/(app)/(tabs)/paymentscreen/[roomId]',
      params:{roomId : roomId}
     })
  }
  return (
    <View style={styles.card}>
      <View style={[styles.form, styles.shadow]}>
        <Text style={[styles.p, styles.b]}>ผู้เข้าพักหลัก</Text>

        <TextInput
          label="ชื่อ"
          mode="outlined"
          outlineStyle={{ borderRadius: 15, borderColor: colors.borderColor, backgroundColor: colors.background }}
          value={userFName}
          onChangeText={text => setUserFName(text)}
        />
        <TextInput
          label="นามสกุล"
          mode="outlined"
          outlineStyle={{ borderRadius: 15, borderColor: colors.borderColor, backgroundColor: colors.background }}
          value={userLName}
          onChangeText={text => setUserLName(text)}
        />
        <TextInput
          label="อีเมล์"
          mode="outlined"
          outlineStyle={{ borderRadius: 15, borderColor: colors.borderColor, backgroundColor: colors.background }}
          value={userEmail}
          onChangeText={text => setUserEmail(text)}
        />
        <TextInput
          label="ประเทศ"
          mode="outlined"
          disabled
          outlineStyle={{ borderRadius: 15, borderColor: colors.borderColor, backgroundColor: colors.background }}
          value={country}
          onChangeText={text => setCountry(text)}
        />
        <TextInput
          label="หมายเลขโทรศัพท์"
          mode="outlined"
          outlineStyle={{ borderRadius: 15, borderColor: colors.borderColor, backgroundColor: colors.background }}
          value={phoneNnumber}
          onChangeText={text => setPhoneNnumber(text)}
        />
      </View>

      <Button  
        mode="contained" 
         buttonColor= {colors.secondary}
        onPress={formSending} 
        style={styles.button}
        >
        ไปขั้นตอนสุดท้ายชำระเงิน
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center'
  },
  form: {
    width: 364,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.background,
    padding: 20,
    gap: 10

  },
  p: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    opacity: 1
  },
  b: {
    fontWeight: 'bold',
  },
  button:{
    margin:20
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

export default BookingFormCard;