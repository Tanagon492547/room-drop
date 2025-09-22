import { StyleSheet, Text, View } from "react-native";

const BillPaymentScreen =()=>{
  return(
    <View style={styles.card}>
      <Text>บิลจ๊ะ</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card:{
    width:328,
    justifyContent:'center',
    alignItems:'center'
  }
})

export default BillPaymentScreen;