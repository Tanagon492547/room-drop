import { colors } from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import DropImageCard from '../DropImageCard';


//จำลองข้อมูล
const initialData = [
  { id: '1', name: 'Goodhotel888', location: 'กรุงเทพมหานคร', checkIn:'15 ต.ค. 2568', checkOut:'20 ต.ค. 2568', url:'' },
  { id: '2', name: 'Suksabuy Palace', location: 'กรุงเทพมหานคร', checkIn:'15 ต.ค. 2568', checkOut:'20 ต.ค. 2568', url:'' },
  { id: '3', name: 'Chiang Mai Resort', location: 'เชียงใหม่', checkIn:'15 ต.ค. 2568', checkOut:'20 ต.ค. 2568', url:'' },
  { id: '4', name: 'Chiang Mai Resort', location: 'เชียงใหม่', checkIn:'15 ต.ค. 2568', checkOut:'20 ต.ค. 2568', url:'' },
  { id: '5', name: 'Chiang Mai Resort', location: 'เชียงใหม่', checkIn:'15 ต.ค. 2568', checkOut:'20 ต.ค. 2568', url:'' },
  { id: '6', name: 'Chiang Mai Resort', location: 'เชียงใหม่', checkIn:'15 ต.ค. 2568', checkOut:'20 ต.ค. 2568', url:'' },
  { id: '7', name: 'Chiang Mai Resort', location: 'เชียงใหม่', checkIn:'15 ต.ค. 2568', checkOut:'20 ต.ค. 2568', url:'' },
];



const handleEdit = (item: any) => {
  Alert.alert('แก้ไข', `คุณกำลังจะแก้ไข: ${item.name}`);
};

const handleDelete = (item: any) => {
  Alert.alert('ลบ', `คุณแน่ใจหรือไม่ว่าจะลบ: ${item.name}`);
  // Logic การลบ item ออกจาก state
};

const DropCard = () => {
  const [listData, setListData] = useState(initialData);
  return (
    <SwipeListView
      data={listData}
      // ส่วนการ์ดที่มองเห็นปกติ
      renderItem={({ item }) => (
        <View style={styles.visibleItem}>
          <View>
            <DropImageCard url={item.url} />
          </View>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.p}>{item.location}</Text>
            <View style={{gap:5}}>
              <View style={[styles.boxContext]}>
                <FontAwesome
                  name="calendar-check-o"
                  size={20}
                  color="#000000ff"
                />
               <Text style={styles.p2}>{item.checkIn}</Text>
              </View>
              <View style={[styles.boxContext]}>
                   <FontAwesome
                  name="calendar-times-o"
                  size={20}
                  color="#000000ff"
                />
                  <Text style={styles.p2}>{item.checkOut}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
      // ส่วน "เมนูลับ" ที่ซ่อนอยู่
      renderHiddenItem={({ item }) => (
        <View style={styles.hiddenItemContainer}>
          <TouchableOpacity
            style={[styles.hiddenButton, styles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.buttonText}>แก้ไข</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.hiddenButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.buttonText}>ลบ</Text>
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={item => item.id}
      rightOpenValue={-150} // <-- ความกว้างของเมนูลับ (75 + 75)
      disableRightSwipe // (แนะนำ) ปิดการสไลด์ไปทางขวา
      style={{ width: '100%'}}
    />
  )
}

const styles = StyleSheet.create({
  visibleItem: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    height:165

  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hiddenItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  hiddenButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: 'orange',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  p: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textLight,
  },
  p2:{
    fontSize:10
  },
  boxContext:{
    display:'flex',
    flexDirection:'row',
    gap:10,
    alignItems:'center',
    paddingHorizontal:5
  }
})

export default DropCard;