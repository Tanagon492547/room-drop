import { colors } from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";

type props = {
  textTitle: string | undefined
}

const TitleText = ({textTitle} : props) =>{
  return(
    <View style={styles.contrian }>
            <Text style={styles.h1}>
              {textTitle}
            </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  contrian  :{
    width:'100%', 
    height:74, 
    backgroundColor: colors.primaryDark, 
    display:'flex', 
    justifyContent:'center', 
    paddingBlock:10, 
    paddingHorizontal:20,
    marginBlock:20
  
  },
    h1:{
      fontSize:25, 
      fontWeight:'400', 
      color:colors.textWhite}
})

export default TitleText;
