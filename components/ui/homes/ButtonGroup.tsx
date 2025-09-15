import { View } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

type props = {
  idItem: string
}

const ButtonGroup =({idItem}:props)=>{
  const [item, setItem] = useState("");

  const reserve =()=>{
    if(!idItem){
      return ;
    }

    setItem(idItem)
    console.log('จองห้องหมายเลข', item)
  }

  const addItemtoCret =()=>{
     if(!idItem){
      return ;
  }
    
    setItem(idItem)
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