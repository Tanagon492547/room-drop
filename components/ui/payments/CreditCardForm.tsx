import { StyleSheet, Text, View } from "react-native";

const CreditCardForm = () =>{
  return(
    <View style={styles.card}>
      <Text>เร็วๆ นี้ CreditCardForm</Text>
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

export default CreditCardForm;