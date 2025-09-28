import { colors } from "@/constants/Colors";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type props = {
  textTitle?: string,
  hotelTitle?: string
}

const TitleText = ({ textTitle, hotelTitle }: props) => {

  const  [dateCheckIn, setDateCheckIn] =  useState('FRI 16 DEC') //วันที่เช็คอินเเทนตรงนี้

  return (
    <View style={styles.contrian}>
      {textTitle && (
        <Text style={styles.h1}>
          {textTitle}
        </Text>
      )}
      {hotelTitle && (
        <View   style={styles.textBox}>
          <Text style={styles.h1}>
            {hotelTitle}
          </Text>
          <Text style={styles.p}>
            {dateCheckIn}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  contrian: {
    width: '100%',
    height: 74,
    backgroundColor: colors.primaryDark,
    display: 'flex',
    justifyContent: 'center',
    paddingBlock: 10,
    paddingHorizontal: 20,
    marginBlock: 20

  },
  h1: {
    fontSize: 25,
    fontWeight: '400',
    color: colors.textWhite
  },
  p:{
    fontSize: 13,
    fontWeight: '200',
    color: colors.textWhite
  },
  textBox:{
    
  }
})

export default TitleText;
