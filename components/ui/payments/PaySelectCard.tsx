import { colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import CreditCardForm from "./CreditCardForm";
import PromptPayForm from "./PromptPayForm";

type props = {
  name?: string,
  phoneNumber?: string,
  roomId?: string,
  nameHotel?: string,
}

const PaySelectCard = ({ name, phoneNumber, roomId, nameHotel }: props) => {
  const [selectedMethod, setSelectedMethod] = useState(true);
  const [status, setStatus] = useState(false); //เช็คสถานะการจ่ายเงิน เเล้วหรือไม่

  const goToBillPaymentScreen = () => {
    console.log('ไปดูบิลของ', roomId)
    router.replace({
      pathname: '/(app)/(tabs)/bills/[roomId]',
      params: { roomId: roomId }
    })
  }
  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.shadow]}>
        <Text style={[styles.position, styles.h1]}>วิธีการชำระเงิน</Text>
        <View style={styles.textBox}>
          <Pressable
            // 2. เลือก style ตามเงื่อนไข
            style={[
              styles.buttonBase,
              selectedMethod ? styles.buttonContained : styles.buttonOutlined
            ]}
            onPress={() => setSelectedMethod(true)}
          >
            <Text style={[
              styles.textBase,
              selectedMethod ? styles.textContained : styles.textOutlined
            ]}>
              PromptPay
            </Text>
          </Pressable>

          {/* ปุ่ม บัตรเครดิต/เดบิต */}
          <Pressable
            style={[
              styles.buttonBase,
              !selectedMethod ? styles.buttonContained : styles.buttonOutlined
            ]}
            onPress={() => setSelectedMethod(false)}
          >
            <Text style={[
              styles.textBase,
              !selectedMethod ? styles.textContained : styles.textOutlined
            ]}>
              บัตรเครดิต/เดบิต
            </Text>
          </Pressable>


        </View>

      </View>
      <View style={[styles.payBox, styles.shadow]}>
        {selectedMethod && (<PromptPayForm />)}
        {!selectedMethod && (<CreditCardForm />)}
      </View>

      <Button
        mode='contained'
        buttonColor={colors.secondary}
        onPress={goToBillPaymentScreen}
        disabled={!status}
        style={{ marginBlock: 20, width: 328 }}
      >ดูรายละเอียดการจอง</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  card: {
    width: 328,
    position: 'relative',
    backgroundColor: colors.background,
    marginHorizontal: 10,
  },
  position: { position: 'absolute', top: -25, left: 5, zIndex: 9 },
  h1: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.text,
    opacity: 0.8
  },
  p: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    opacity: 0.7
  },
  p2: {
    fontSize: 15,
    fontWeight: '300',
    color: colors.text,
    opacity: 0.6
  },
  textBox: { flexDirection: 'row', justifyContent: 'space-between' },
  shadow: {
    ...Platform
      .select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
        },
        android: {
          elevation: 4,
        },
      }),
  },
  buttonBase: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // สไตล์เหมือน mode="contained"
  buttonContained: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    opacity: 0.9
  },
  // สไตล์เหมือน mode="outlined"
  buttonOutlined: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
    opacity: 0.5
  },
  // สไตล์พื้นฐานของข้อความ
  textBase: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  // สไตล์ข้อความของปุ่มทึบ
  textContained: {
    color: 'white',
  },
  // สไตล์ข้อความของปุ่มเส้นขอบ
  textOutlined: {
    color: colors.primary,
  },
  payBox: {
    width: 328,
    height: 277,
    borderRadius: 10,
    backgroundColor: colors.background,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
export default PaySelectCard;