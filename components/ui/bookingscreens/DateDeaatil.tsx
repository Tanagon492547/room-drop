import { colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type props = {
  checkInDate?:string,
  checkOutDate?:string,
  dayCount?:number
}

const DateDeatil =({checkInDate, checkOutDate, dayCount}:props)=>{

return(
  <View style={styles.dateContainer}>
        <View>
          <Text style={styles.p1}>เช็คอิน</Text>
          <Text style={styles.p2}>{checkInDate}</Text>
        </View>
        <View><FontAwesome name="arrow-right" size={24} color="black" /></View>
        <View>
          <Text style={styles.p1}>เช็คเอาต์</Text>
          <Text style={styles.p2}>{checkOutDate}</Text>
        </View>
        <View style={styles.text}>
          <Text style={styles.p2}>{dayCount}</Text>
          <Text style={styles.p2}>คืน</Text>
        </View>
      </View>
)
}

const styles = StyleSheet.create({
    dateContainer:{
      width:364, 
      flexDirection:'row', 
      justifyContent:'space-between', 
      alignItems:'center',
      backgroundColor:colors.background,
      borderRadius:10,
      margin:23,
      paddingHorizontal:15,
      paddingBlock:5
    },
    p1:{
      fontSize:10,
      color:colors.text,
      opacity:0.6
    },
    p2:{
      fontSize:15,
      color:colors.text,
      fontWeight:'bold'
    },
    text:{
      alignItems:'center'
    }
  
})

export default DateDeatil;