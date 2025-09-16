import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AvatarProfile from "./AvatarProfile";

const Profile =(onSave:any)=>{
    const [userFname, setUserFname] = useState('');
    const [userLname, setUserLname] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userPropPay, setUserPropPay] = useState('');
    const [email, setEmail] = useState('');
    const [urlImage, setUrlImage] = useState('');


  return(
    <View style={styles.container}>
      <View style={styles.datailCard}>
        <AvatarProfile urlImage={urlImage} width={100} height={100} />
        <View >
          <Text style={styles.h1}>{userFname ? userFname : 'ไม่มีข้อมูล'}  {userLname? userLname : 'ไม่มีข้อมูล'}</Text>
          <View style={styles.detail}>
            <Text style={styles.h2}>Email :</Text>
            <Text style={styles.p}>{email? email : 'ไม่มีข้อมูล'}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.h2}>phone number :</Text>
            <Text style={styles.p}>{userPhone? userPhone : 'ไม่มีข้อมูล'}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.h2}>PromptPay :</Text>
            <Text style={styles.p}>{userPropPay? userPropPay : 'ไม่มีข้อมูล'}</Text>
          </View>
        </View>
      </View>
    </View>
  ) 
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  datailCard:{
    width:'90%',
    backgroundColor:'#0065C3',
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:15,
    gap:20,
    paddingBlock:50
  },
  detail:{
    display:'flex',
    flexDirection:'row',
  },
  h1:{
    fontSize:20,
    fontWeight:'800',
    color:'white'
  },
  h2:{
    fontSize:10,
    fontWeight:'500',
    color:'white'
  },
  p:{
    fontSize:10,
    fontWeight:'300',
    color:'white'
  }

});
export default Profile;