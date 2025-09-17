import { FlatList, StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import ContainerCard from '@/components/ui/homes/ContainerCard';
import Header from '../../components/ui/Header';

const mockData = [
  {
    "idItem": "booking-001",
    "idUser": "user-101",
    "nameHotel": "โรงแรมริมหาด",
    "nameFull": "นายสมชาย ใจดี",
    "address": "123 หาดเฉวง เกาะสมุย สุราษฎร์ธานี",
    "price": 2500,
    "url": "",
    "dateCheck": "2025-10-20",
    "dateOut": "2025-10-22",
    "dayCount": 2
  },
  {
    "idItem": "booking-002",
    "idUser": "user-102",
    "nameHotel": "โรงแรมกลางกรุง",
    "nameFull": "นางสาวสมหญิง มีสุข",
    "address": "456 ถนนสุขุมวิท กรุงเทพมหานคร",
    "price": 3200,
    "url": "",
    "dateCheck": "2025-11-05",
    "dateOut": "2025-11-06",
    "dayCount": 1
  },
  {
    "idItem": "booking-003",
    "idUser": "user-101",
    "nameHotel": "วิลล่าภูเขา",
    "nameFull": "นายสมชาย ใจดี",
    "address": "789 หมู่ 5 เขาใหญ่ นครราชสีมา",
    "price": 5800,
    "url": "",
    "dateCheck": "2025-12-10",
    "dateOut": "2025-12-15",
    "dayCount": 5
  },
  {
    "idItem": "booking-004",
    "idUser": "user-103",
    "nameHotel": "บูติครีสอร์ท",
    "nameFull": "นายเอกชัย สามารถ",
    "address": "101 ถนนนิมมานเหมินท์ เชียงใหม่",
    "price": 4100,
    "url": "",
    "dateCheck": "2026-01-22",
    "dateOut": "2026-01-24",
    "dayCount": 2
  },
  {
    "idItem": "booking-005",
    "idUser": "user-104",
    "nameHotel": "โรงแรมริมหาด",
    "nameFull": "นางสาวมานี รักไทย",
    "address": "123 หาดเฉวง เกาะสมุย สุราษฎร์ธานี",
    "price": 2750,
    "url": "",
    "dateCheck": "2026-02-14",
    "dateOut": "2026-02-16",
    "dayCount": 2
  }
]

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Header showSearch={true} />
      <FlatList
        data={mockData}

        renderItem={({ item }) => (
          <ContainerCard
            nameHotel={item.nameHotel}
            nameFull={item.nameFull}
            idUser={item.idUser}
            address={item.address}
            price={item.price}
            url={item.url}
            dateCheck={item.dateCheck}
            dateOut={item.dateOut}
            idItem={item.idItem}
            dayCount={item.dayCount}
          />
        )}

        keyExtractor={item => item.idItem}
        contentContainerStyle={{
          paddingRight: 0,
          paddingLeft: 16,
          backgroundColor: 'transparent'
        }}
        style={{ backgroundColor: 'transparent' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //marginBlock:10,
    backgroundColor:'transparent'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
