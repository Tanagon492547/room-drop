import RoomForm from "@/components/ui/droprooms/RoomForm";
import TitleText from "@/components/ui/TitleText";
import { StyleSheet, View } from "react-native";

const DropRoom =()=>{
  return(
    <View style={styles.contarin}>
        <TitleText textTitle="Drop Room" />
        <RoomForm />
    </View>
  )
} 

const styles = StyleSheet.create({
  contarin:{
    width:'100%',
    flex:1,
    alignItems:'center'
  }
})

export default DropRoom;