import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

type colorProps = {
  color : string | undefined
  size: number | undefined
  fontSize: number | undefined
}

const LogoTitle =({color,size, fontSize }:colorProps)=>{
  return(
    <Pressable style={styles.logoArea} onPress={()=>router.replace('/')}>
      <FontAwesome name='home' size={size} color={color} />
      <Text style={[styles.h1, {fontSize: fontSize , color:color}]}>Room drop</Text>

    </Pressable>
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