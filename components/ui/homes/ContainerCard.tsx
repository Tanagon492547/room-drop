import { View } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import { Platform, StyleSheet, Text } from "react-native";
import ButtonGroup from "./ButtonGroup";
import ImgCard from "./ImgCard";
import LineBox from "./LineBox";



type props = {
  nameHotel: string | undefined,
  nameFull: string | undefined,
  idUser: string | undefined,
  address: string | undefined,
  price: number | undefined,
  url: string | undefined, //ลิงค์รูป
  dateCheck: string | undefined,
  dateOut: string | undefined,
  roomId: string | undefined, // หมายเลขไอดียืนยันห้อง
  dayCount : number | undefined

}

const ContainerCard = ({nameHotel,nameFull, idUser, address, price, url, dateCheck, dateOut, roomId, dayCount }:props) => {
  return (
    <View style={styles.container}>
      <View style={[styles.cardBody, styles.shadow]}>
        
        <ImgCard url={url} dayCount={dayCount}  roomId={roomId}  nameHotel={nameHotel} />

        <View style={styles.textCrad}>
          <View style={styles.detailCard}>
            <Text style={styles.h1}>{nameHotel? nameHotel : 'ไม่มีข้อมูล'}</Text>
            <Text >{nameFull? nameFull : 'ไม่มีข้อมูล'}</Text>
            <Text>ผู้ปล่อยห้อง </Text>
            <Text style={styles.p}>{address? address : 'ไม่มีข้อมูล'}</Text>
            <Text style={styles.h2}>ราคา : {price? price : 'ไม่มีข้อมูล'} </Text>
          </View>
          <View style={{ backgroundColor: 'transparent', flex: 1, alignItems: "center", justifyContent: 'center', gap: 20 }}>
            <View style={styles.iconCalendar}>
              <FontAwesome name="calendar-check-o" size={30} />
              <Text style={styles.p2}>{dateCheck? dateCheck : 'ไม่มีข้อมูล'}</Text>
            </View >
            <View style={styles.iconCalendar}>
              <FontAwesome name="calendar-times-o" size={30} />
              <Text style={styles.p2}>{dateOut? dateOut : 'ไม่มีข้อมูล'}</Text>
            </View>
          </View>
        </View>
        
        <LineBox  />
        
        <ButtonGroup roomId={roomId? roomId:''} />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '95%',
    display: 'flex',
    alignItems: 'center',
    paddingBlock: 20,
    backgroundColor: 'transparent'
  },
  cardBody: {
    width: '100%',
    padding: 1,
    backgroundColor: 'white',
    minHeight: 380,
    borderRadius: 20,
    display: 'flex',
    paddingBottom: 20
  },
  h1: {
    fontSize: 30,
    fontWeight: '700'
  },
  h2: {
    fontSize: 20,
    fontWeight: '800',
    paddingTop: 10
  },
  h3: {
    fontSize: 20,
    color: 'red',
    fontWeight: '700'
  },
  p: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  p2: {
    fontSize: 12,
    fontWeight: '800',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3, // เงาชี้ลง
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 10,
      },

    }),
  },
  buttonPressed: {
    opacity: 0.8, // ทำให้จางลงตอนกด
  },
  buttonHovered: {
    backgroundColor: '#6495ED',
  },
  textCrad: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingHorizontal: 5
  },
  detailCard: {
    backgroundColor: 'transparent',
    alignContent: 'center',
    display: 'flex',
    gap: 5
  },
  iconCalendar: {
    backgroundColor: 'transparent',
    display: 'flex', flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  
  
})

export default ContainerCard;