import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";

const RoomForm = () => {
  const [fnameUser, setFnameUser] = useState('');
  const [lnameUser, setLnameUser] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [promptPay, setPromptPay] = useState('');
  const [uploadFile, setUploadFile] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [addressHotel, setAaddressHotel] = useState('');
  const [price, setPrice] = useState('');
  const [nameHotel, setNameHotel] = useState('');
  const [linkHotel, setLinkHotel] = useState('');
  const [evidenceUpload, setEvidenceUpload] = useState('')

  const uploading = () => {
    console.log('อัปโหลดไฟล์ที่นี่')
  }

   const evidenceUploading = () => {
    console.log('อัปโหลดไฟล์หลักฐานที่นี่')
  }

  const sendForm = () => {
    console.log('ส่งฟอร์์มที่นี่')
  }

  return (
    <View style={styles.form}>
      <ScrollView style={{ height: 580 }}>
        <View style={styles.formIn}>
          <Text style={styles.h1}>ผู้ปล่อยห้อง</Text>

          <View style={styles.inputArea}>
            <Text>ชื่อ</Text>
            <TextInput
              placeholder="ชื่อ"
              style={styles.input}
              value={fnameUser}
              onChangeText={setFnameUser}
            />
          </View>

          <View style={styles.inputArea}>
            <Text>นามสกุล</Text>
            <TextInput
              placeholder="นามสกุล"
              style={styles.input}
              value={lnameUser}
              onChangeText={setLnameUser}
            />
          </View>

          <View style={styles.inputArea}>
            <Text>หมายเลขโทรศัพท์</Text>
            <TextInput
              placeholder="หมายเลขโทนศัพท์"
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <View style={styles.inputArea}>
            <Text>พร้อมเพย์</Text>
            <TextInput
              placeholder="พร้อมเพย์"
              style={styles.input}
              value={promptPay}
              onChangeText={setPromptPay}
            />
          </View>

          <View style={styles.inputArea}>
            <View style={styles.button}>
              <Button
                icon="upload"
                mode="outlined"
                onPress={uploading}>
                เเนบรูปโรงเเรม
              </Button>
            </View>
          </View>

          <View style={styles.dateinputArea}>
            <View>
              <Text>วันที่เช็คอิน</Text>
              <View style={styles.iconArea}>
                <TextInput
                  style={styles.inputDate}
                  placeholder="22/09/2899"
                  value={checkIn}
                  onChangeText={setCheckIn}
                />
                <FontAwesome
                  name="calendar-check-o"
                  color='#9d9d9db3'
                  style={styles.icon}
                  size={25}
                />
              </View>
            </View>
            <View>
              <Text>วันที่เช็คเอาต์</Text>
              <View style={styles.iconArea}>
                <TextInput
                  style={styles.inputDate}
                  placeholder="22/09/2999"
                  value={checkOut}
                  onChangeText={setCheckOut}
                />
                <FontAwesome
                  name="calendar-times-o"
                  color='#9d9d9db3'
                  style={styles.icon}
                  size={25}
                />
              </View>
            </View>
          </View>

           <View style={styles.inputArea}>
            <Text>ชื่อโรงเเรม</Text>
            <TextInput
              placeholder="ชื่อโรงเเรม"
              style={styles.input}
              value={nameHotel}
              onChangeText={setNameHotel}
            />
          </View>

          <View style={styles.inputArea}>
            <Text>ที่อยู่โรงเเรม</Text>
            <TextInput
              placeholder="ที่อยู่โรงเเรม"
              style={styles.input}
              value={addressHotel}
              onChangeText={setAaddressHotel}
            />
          </View>

          <View style={styles.inputArea}>
            <Text>ราคา</Text>
            <TextInput
              placeholder="ราคา"
              style={styles.input}
              value={price}
              onChangeText={setPrice}
            />
          </View>

           <View style={styles.inputArea}>
            <Text>ลิงก์รายละเอียดโรงเเรม</Text>
            <TextInput
              placeholder="ลิงก์รายละเอียดโรงเเรม"
              style={styles.input}
              value={linkHotel}
              onChangeText={setLinkHotel}
            />
          </View>
          
          <View style={styles.inputArea}>
              <Button
                icon="paperclip"
                mode="outlined"
                style={{alignItems:'flex-start', borderRadius:5}}
                onPress={evidenceUploading}>
                เเนบหลักฐานการจอง
              </Button>
          </View>

          <View style={styles.inputArea}>
             <View style={{width:'100%', alignItems:'center', marginTop:20}}>
               <Button
                mode="contained"
                buttonColor='#1C5CB7'
                style={{width:200, borderRadius:5}}
                onPress={sendForm}>
                ลงประกาศ
              </Button>
             </View>
          </View>
         
        </View>
      
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    padding: 10,
  },
  formIn: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 17,
    paddingHorizontal: 20,
    gap: 10,
    paddingBlock:20
  },
  input: {
    borderColor: '#9d9d9db3',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10
  },
  inputArea: {
    gap: 10,
    marginHorizontal: 10,
  },
  button: {
    width: 150
  },
  dateinputArea: {
    gap: 10,
    marginHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  inputDate: {
    borderColor: '#9d9d9db3',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 40,
    fontSize: 10,
    width: 140
  },
  icon: {
    position: 'absolute',
    top: 5,
    left: 8
  },
  iconArea: {
    position: 'relative'
  },
  h1:{
    fontSize:20,
    fontWeight:'800'
  }
})

export default RoomForm;