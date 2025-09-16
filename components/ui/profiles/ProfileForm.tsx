import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

type props = {
  email : string | undefined,
  password : string | undefined
}

const Profile = ({email, password}:props) => {
  const [userFname, setUserFname] = useState('');
  const [userLname, setUserLname] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPropPay, setUserPropPay] = useState('');

  const doStatusMatch = useMemo(()=>{
    if (!userFname || !userLname || !userPhone || !userPropPay) return true;
    return true;

  }, [userFname, userLname, userPhone, userPropPay]);

  const isFormReady =  userFname && userLname && userPhone && userPropPay && doStatusMatch;

  const selectingImage =()=>{
    // ฟัังชันเรียกใช้ให้ User เลือกโปรไฟล์ที่นี่
    console.log("เปลี่ยนรูป")
  }

  const sedingData =()=>{
    // ส่งข้อมูลเข้า ฐานข้อมูลที่นี่
    console.log('ส่งข้อมูล')
    router.replace('/login')
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.selectProfile}>
        <Pressable onPress={selectingImage}>
          <Text style={styles.underline}>เปลี่ยนรูปโปรไฟล์</Text>
        </Pressable>
      </View>

      <View style={styles.cardBody}>
        <Image
          source={{ uri: 'https://as1.ftcdn.net/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg' }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.formContarin}>
        <View style={styles.formCard}>
          <Text style={styles.h1}>ข้อมูลส่วนตัว</Text>

          <TextInput
            label="ชื่อ"
            placeholder="สมชาย"
            value={userFname? userFname : ''}
            onChangeText={setUserFname}
            mode='outlined'
            outlineStyle={{ borderRadius: 18 }}
          />

          <TextInput
            label="นามสกุล"
            placeholder="จึงรอด"
            value={userLname? userLname : ''}
            onChangeText={setUserLname}
            mode='outlined'
            outlineStyle={{ borderRadius: 18 }}
          />

          <TextInput
            label={email}
            placeholder="ex@gmail.com"
            mode='outlined'
            outlineStyle={{ borderRadius: 18 }}
            disabled
          />

          <TextInput
            label="หมายเลขมือถือ"
            placeholder="0875481934"
            value={userPhone? userPhone : ''}
            onChangeText={setUserPhone}
            mode='outlined'
            outlineStyle={{ borderRadius: 18 }}
          />

          <TextInput
            label="หมายเลขพร้อมเพย์"
            placeholder="เบอร์มือถือ หรือบัตรประชาชน 13 หลัก"
            value={userPropPay? userPropPay : ''}
            onChangeText={setUserPropPay}
            mode='outlined'
            outlineStyle={{ borderRadius: 18 }}
          />
        </View>
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', marginBlock: 40, gap: 15 }}>
        <Button
          mode="contained"
          buttonColor='green'
          contentStyle={{ width: '50%' }}
          onPress={sedingData}
          disabled={!isFormReady}
          style={styles.button}  
        >
          <FontAwesome name="check" size={20} />
        </Button>
        <Button
          mode="contained"
          buttonColor='red'
          contentStyle={{ width: '50%' }}
          onPress={() => console.log('Pressed')}
          style={styles.button}    
        >
          <FontAwesome  name="times" size={23} />
        </Button>
      </View>

    </ScrollView>
  )
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  selectProfile: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 20, paddingEnd: 10,
    backgroundColor: 'transparent'
  },
  underline: {
    textDecorationLine: 'underline',
    color: 'blue'
  },
  cardBody: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  avatar: {
    width: 190,
    height: 190,
    borderRadius: 100,
    backgroundColor: '#777777ff',
  },
  formContarin: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  h1: {
    fontSize: 25,
    fontWeight: '800'
  },
  formCard: {
    width: '90%',
    display: 'flex',
    gap: 10,
  },
  button:{
    alignItems:'center'
  }
})
export default Profile;