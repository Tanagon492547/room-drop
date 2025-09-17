import { View } from "@/components/Themed";
import { StyleSheet } from "react-native";

const LineBox = () => {
  return (
    <View style={styles.lineBox}>
      <View style={styles.line} />
      <View style={styles.line} />
    </View>
  )
}

const styles = StyleSheet.create({

  line: {
    flex: 1, // 3. ทำให้เส้นสองข้างยืดขยายเต็มพื้นที่ที่เหลือ
    height: 1, // ความหนาของเส้น
    backgroundColor: '#000000ff', // สีของเส้น (สีเทาอ่อน)
  },
  lineBox: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: 'transparent'
  },
})

export default LineBox;