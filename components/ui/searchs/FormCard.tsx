import { View } from "@/components/Themed";
import { colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, TextInput } from 'react-native-paper';



const FormCard = () => {
  const [text, setText] = useState(""); //ค้นหาห้อง
  const [checkInSelectedDate, setCheckInSelectedDate] = useState(""); 
  const [checkoutSelectedDate, setCheckOutSelectedDate] = useState("");
  const [price, setPrice] = useState("");
  
  return (
    <View style={styles.inputArea}>
      <View style={styles.inputBox}>
        <FontAwesome
          name="search"
          size={25}
          color="#6C6C6C"
          style={{ position: 'absolute', zIndex: 1, paddingLeft: 15 }}
        />
        <TextInput
          label="Chose Location...."
          value={text}
          mode='outlined'
          outlineStyle={{ borderRadius: 50 }}
          style={{ paddingHorizontal: 25 }}
          contentStyle={{}}
          onChangeText={text => setText(text)}
        />
      </View>

      <View style={styles.datesArea}>
        <View style={styles.dateinputArea}>
          <FontAwesome
            name="calendar-check-o"
            size={25}
            color="#6C6C6C"
            style={{ position: 'absolute', zIndex: 1, paddingLeft: 15 }}
          />
          <TextInput
            label="Check-In"
            placeholder="DD/MM/YY"
            value={checkInSelectedDate}
            mode='outlined'
            outlineStyle={{ borderRadius: 50 }}
            style={{ paddingHorizontal: 30 }}
            contentStyle={{}}
            onChangeText={checkInSelectedDate => setCheckInSelectedDate(checkInSelectedDate)}
          />
        </View>

        <View style={styles.dateinputArea}>
          <FontAwesome
            name="calendar-times-o"
            size={25}
            color="#6C6C6C"
            style={{ position: 'absolute', zIndex: 1, paddingLeft: 15 }}
          />
          <TextInput
            label="Check-out"
            placeholder="DD/MM/YY"
            value={checkoutSelectedDate}
            mode='outlined'
            outlineStyle={{ borderRadius: 50 }}
            style={{ paddingHorizontal: 30 }}
            contentStyle={{}}
            onChangeText={checkoutSelectedDate => setCheckOutSelectedDate(checkoutSelectedDate)}
          />
        </View>
      </View>

      <View style={styles.inputBox}>
        <FontAwesome
          name="search"
          size={25}
          color="#6C6C6C"
          style={{ position: 'absolute', zIndex: 1, paddingLeft: 15 }}
        />

        <TextInput
          label="ราคา"
          placeholder="XXXXX"
          value={price}
          mode='outlined'
          outlineStyle={{ borderRadius: 50 }}
          style={{ paddingHorizontal: 25 }}
          contentStyle={{}}
          onChangeText={price => setPrice(price)}
        />
      </View>

      <Button
        style={styles.button}
        icon="" 
        mode="contained" 
        onPress={() => console.log('Pressed')}>
         ค้นหา
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  inputArea: {
    width: 360,
    borderRadius: 10,
    minHeight: 314,
    backgroundColor: colors.background,
    marginTop: 50,
    paddingTop: 30,
    display: 'flex',
    alignItems: 'center',
    gap: 15
  },
  inputBox: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    width: '90%',
    backgroundColor: 'transparent'
  },
  datesArea: {
    flexDirection: 'row',      // <-- ✨ 1. สั่งให้ลูกเรียงกันแนวนอน
    justifyContent: 'space-between', // <-- ✨ 2. สั่งให้ลูกแยกกันไปอยู่สุดขอบ
    width: '100%',
    paddingHorizontal: '5%', // (แนะนำ) เพิ่ม padding เพื่อให้สวยงาม
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  dateinputArea: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    width: '48%',
    backgroundColor: 'transparent'
  },
  button:{
    width:'90%',
    marginTop:10
  }
});
export default FormCard;