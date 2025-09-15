import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type colorProps = {
  color : string | undefined
}

const LogoTitle =({color}:colorProps)=>{
  return(
    <View style={styles.logoArea}>
      <FontAwesome name='home' size={30} color={color} />
      <Text style={[styles.h1, {color:color}]}>Room drop</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  logoArea:{
    flexDirection:'column',
    display:'flex',
    alignItems:'center'
  },
  h1:{
    fontSize: 10,
    fontWeight: 'bold',
  }
})

export default LogoTitle;