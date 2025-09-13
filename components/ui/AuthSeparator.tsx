import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const AuthSeparator = () =>{
  return(
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>OR</Text>
      <View style={styles.line} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // 1. ทำให้เส้นกับตัวอักษรเรียงกันแนวนอน
    alignItems: 'center', // 2. จัดให้อยู่ตรงกลางแนวตั้ง
    paddingVertical: 20, // เพิ่มระยะห่างบนล่าง
  },
  line: {
    flex: 1, // 3. ทำให้เส้นสองข้างยืดขยายเต็มพื้นที่ที่เหลือ
    height: 1, // ความหนาของเส้น
    backgroundColor: '#D1D5DB', // สีของเส้น (สีเทาอ่อน)
  },
  text: {
    marginHorizontal: 15, // 4. เพิ่มระยะห่างระหว่างเส้นกับตัวอักษร
    fontSize: 14,
    color: '#6B7280', // สีตัวอักษร (สีเทา)
    fontWeight: '600',
  },
});

export default AuthSeparator;