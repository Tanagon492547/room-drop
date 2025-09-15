import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type colorProps = {
  color : string | undefined
  size: number | undefined
  fontSize: number | undefined
}

const LogoTitle =({color,size, fontSize }:colorProps)=>{
  return(
    <View style={styles.logoArea}>
      <FontAwesome name='home' size={size} color={color} />
      <Text style={[styles.h1, {fontSize: fontSize , color:color}]}>Room drop</Text>

    </View>
  )
}

const styles = StyleSheet.create({
  logoArea:{
    flexDirection:'column',
    display:'flex',
    alignItems:'center',
  },
  h1:{
    fontWeight: 'bold',
  }
})

export default LogoTitle;