import { StyleSheet, Text, View } from "react-native";

type props = {
  promptpay?: string, // พร้อมเพย์คนขาย
  price?: number, //ราคา
}

const PromptPayForm = ({promptpay, price}:props) =>{
  return(
    <View style={styles.card}>
      <Text>PromptPayForm</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card:{
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  }
})

export default PromptPayForm;