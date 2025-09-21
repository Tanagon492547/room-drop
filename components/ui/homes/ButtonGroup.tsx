import { View } from "@/components/Themed";
import { colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

type props = {
  roomId: string
}

const ButtonGroup =({roomId}:props)=>{
  const [item, setItem] = useState("");

  const reserve =()=>{
    if(!roomId){
      return ;
    }

    setItem(roomId)
    console.log('จองห้องหมายเลข', item)
    router.replace({
      pathname:'/(app)/(tabs)/bookroom',
      params: { roomId: roomId },
    }
      
    )
  }

  const addItemtoCret =()=>{
     if(!roomId){
      return ;
  }
    
    setItem(roomId)
    console.log('เพิ่มห้องใส่ตระกร้า', item)
  }

  return(
    <View
     style={styles.buttonGroup}>
              <Button  
                contentStyle={{width:156}} 
                mode="contained" onPress={() => console.log('Pressed')}
                labelStyle={{ fontSize: 25 }} 
                onPressOut={reserve}

                buttonColor={colors.secondary}
              >
                จอง
              </Button>
              <Button  
                contentStyle={{width:76}} 
                mode="outlined" onPress={() => console.log('Pressed')}
                labelStyle={{ fontSize: 10 }}
                onPressOut={addItemtoCret}
              >
                <FontAwesome name="shopping-cart" size={20} />
              </Button>
            </View>
  )
}

const styles = StyleSheet.create({
  buttonGroup:{ 
    width: '100%', 
    display:'flex', 
    gap:5,flexDirection:'row',
    justifyContent:'flex-end', 
    backgroundColor:'transparent', 
    paddingEnd:20 }
})

export default ButtonGroup;