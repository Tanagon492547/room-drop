import { colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import DropImageCard from "../DropImageCard";

type props = {
  url?: string,
  hotelTitle?: string,
  address?: string,
  hotelDetail?:string,
}

const  HotelDDetailCard  =({url, hotelTitle, address, hotelDetail}:props)=>{
  return(
     <View style={{ width: '100%' }}>
          <DropImageCard url={url} width={373} height={206} detailCard={true} />
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems:'center' }}>
              <FontAwesome name="map-marker" size={20} color='red' />
              <Text style={styles.h1}>{hotelTitle}</Text>
            </View>
            <View>
              <Text style={styles.h2}>ตำเเหน่งที่ตั้ง</Text>
              <Text style={styles.p1}>{address}</Text>
            </View>
            <View>
              <Text style={styles.h3}>รายละเอียด และข้อมูลของโรงแรม</Text>
              <Text style={styles.p2}>{hotelDetail}</Text>
            </View>
          </View>
        </View>
  )
}

const styles =  StyleSheet.create({
  h1:{
    fontSize:25,
    fontWeight:'bold'
  },
  h2:{
    fontSize:20,
    fontWeight:'bold',
    color:colors.textSecondary,
  },
  h3:{
    fontSize:18,
    fontWeight:'bold',
    color:colors.text,
  },
  p1:{
     fontSize:15,
    fontWeight:'600',
    color:colors.text,
    paddingHorizontal:10,
    opacity: 0.5
  },
  p2:{
     fontSize:15,
    fontWeight:'600',
    color:colors.text,
    paddingHorizontal:10,
    opacity: 0.8
  }

})

export default HotelDDetailCard;