// DropCard.tsx
import { colors } from '@/constants/Colors';
import { auth, db, storage } from '@/constants/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import DropImageCard from '../DropImageCard';

type ListItem = {
  id: string;
  name: string;        // hotel_name
  location: string;    // hotel_location
  checkIn: string;     // room_date_checkIn
  checkOut: string;    // room_date_checkOut
  url: string;         // prefer room_photoURL, fallback to hotel_photoURL
};

const truncateText = (text: any, maxLength: any) => {
  // ถ้าข้อความไม่ยาวเกิน ก็ให้แสดงผลปกติ
  if (text.length <= maxLength) {
    return text;
  }
  // ถ้าข้อความยาวเกิน ให้ตัดแล้วต่อท้ายด้วย ...
  return text.substring(0, maxLength) + '...';
};

const DropCard = () => {
  const [listData, setListData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const uid = useMemo(() => auth.currentUser?.uid ?? null, []);
  const [status, setStatus] = useState(1); //สถานะการขาย จำรองไว้ เก็บค่าเป็นตัวเลขนะ

  const checkinStatsBill =  () =>{
    if(status === 1){
      console.log('ดูสลิปที่นี่')
    }
  }

  async function safeDeleteFile(url?: string | null) {
    if (!url || typeof url !== 'string') return;
    // Only try deleting hosted files, ignore local file://
    if (!url.startsWith('http')) return;
    try {
      // ref(storage, url) accepts a gs:// or https download URL
      await deleteObject(ref(storage, url));
    } catch (e: any) {
      // Ignore if already gone or permission issue during dev
      console.log('safeDeleteFile skip:', e?.code || e?.message || e);
    }
  }


  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'rooms'), where('user_id', '==', uid));
    const unsub = onSnapshot(
      q,
      async (snap) => {
        try {
          const rooms = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

          const hotelIds = Array.from(new Set(rooms.map((r) => r.hotel_id).filter(Boolean)));

          const hotelDocs = await Promise.all(
            hotelIds.map(async (hid) => {
              const hSnap = await getDoc(doc(db, 'hotels', hid));
              return { id: hid, data: hSnap.exists() ? hSnap.data() : null };
            })
          );

          const hotelMap = new Map<string, any>(hotelDocs.map((h) => [h.id, h.data]));

          const items: ListItem[] = rooms.map((r) => {
            const hotel = r.hotel_id ? hotelMap.get(r.hotel_id) : null;
            return {
              id: r.id,
              name: r.hotel_name || hotel?.hotel_name || 'Unknown Hotel',
              location: hotel?.hotel_location || r.hotel_location || '-',
              checkIn: r.room_date_checkIn || '',
              checkOut: r.room_date_checkOut || '',
              url: r.room_photoURL || hotel?.hotel_photoURL || '',
            };
          });

          setListData(items);
        } catch (err) {
          console.error('Failed to load rooms/hotels:', err);
          Alert.alert('Error', 'Cannot load your rooms right now.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Rooms snapshot error:', err);
        setLoading(false);
        Alert.alert('Error', 'Cannot listen to your rooms.');
      }
    );

    return () => unsub();
  }, [uid]);

  const handleEdit = (item: ListItem) => {
    // Navigate to the same droproom page but with a query param ?roomId=...
    router.push({ pathname: '/(app)/(tabs)/droproom', params: { roomId: item.id } });
  };

  const handleDelete = (item: ListItem) => {
    Alert.alert(
      'Delete room',
      `Are you sure you want to delete "${item.name}"? This can’t be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // 1) Read full room doc to get URLs and hotel_id
              const roomRef = doc(db, 'rooms', item.id);
              const roomSnap = await getDoc(roomRef);
              if (!roomSnap.exists()) {
                await deleteDoc(roomRef); // in case it’s a ghost row
                return;
              }
              const room = roomSnap.data() as any;
              const roomPhotoURL: string | undefined = room.room_photoURL;
              const roomBillURL: string | undefined = room.room_bill;
              const hotelId: string | undefined = room.hotel_id;

              // 2) If you create a hotel per room, we may clean it up if no other rooms point to it
              let isLastRoomForHotel = false;
              let hotelCoverURL: string | undefined;

              if (hotelId) {
                const sibsSnap = await getDocs(query(collection(db, 'rooms'), where('hotel_id', '==', hotelId)));
                // If only this room references that hotel, we’ll remove the hotel & its image too
                if (sibsSnap.size <= 1) {
                  isLastRoomForHotel = true;
                  const hotelRef = doc(db, 'hotels', hotelId);
                  const hotelSnap = await getDoc(hotelRef);
                  if (hotelSnap.exists()) {
                    const hotel = hotelSnap.data() as any;
                    hotelCoverURL = hotel.hotel_photoURL;
                  }
                }
              }

              // 3) Delete Storage files for the room
              await Promise.allSettled([
                safeDeleteFile(roomPhotoURL),
                safeDeleteFile(roomBillURL),
              ]);

              // 4) Delete the room document
              await deleteDoc(roomRef);

              // 5) Optionally, clean up hotel if unused
              if (hotelId && isLastRoomForHotel) {
                // delete hotel cover image then hotel doc
                await safeDeleteFile(hotelCoverURL);
                await deleteDoc(doc(db, 'hotels', hotelId));
              }
            } catch (e: any) {
              console.error('Delete failed:', e);
              Alert.alert('Error', 'Failed to delete room.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.visibleItem, { justifyContent: 'center', height: 120 }]}>
        <ActivityIndicator />
      </View>
    );
  }
  const MAX_CHAR_LIMIT = 13; // <-- 2. กำหนดจำนวนตัวอักษรสูงสุดที่นี่

  return (
    <SwipeListView
      data={listData}
      renderItem={({ item }) => (
        <View style={styles.visibleItem}>
          <View style={styles.img}>
            <DropImageCard url={item.url} height={125} />
          </View>
          <View style={{width: 140 }}>
            <Pressable
              onPress={checkinStatsBill}
              style={[styles.status,
              status === 0 && (styles.isSold),
              status === 1 && (styles.isActive),
              status === 2 && (styles.isExpired)
              ]}>
              <Text style={styles.statusText}>
                  {status === 0 && 'ขายแล้ว'}
                  {status === 1 && 'กำลังขาย'}
                  {status === 2 && 'หมดอายุ'}
              </Text>
            </Pressable>
            <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail" >{truncateText(item.name, MAX_CHAR_LIMIT)}</Text>
            <Text style={styles.p} numberOfLines={1} ellipsizeMode="tail">{truncateText(item.location, MAX_CHAR_LIMIT)}</Text>
            <View style={{ gap: 5 }}>
              <View style={[styles.boxContext]}>
                <FontAwesome name="calendar-check-o" size={20} color="#000000ff" />
                <Text style={styles.p2}>{item.checkIn}</Text>
              </View>
              <View style={[styles.boxContext]}>
                <FontAwesome name="calendar-times-o" size={20} color="#000000ff" />
                <Text style={styles.p2}>{item.checkOut}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
      renderHiddenItem={({ item }) => (
        <View style={styles.hiddenItemContainer}>
          <TouchableOpacity
            style={[styles.hiddenButton, styles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.hiddenButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={(item) => item.id}
      rightOpenValue={-150}
      disableRightSwipe
      // disableLeftSwipe
      style={{ width: '100%' }}
    />
  );
};

const styles = StyleSheet.create({
  visibleItem: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    gap: 10,
    height: 165,
    justifyContent:'space-between'
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
  p2: {
    fontSize: 10,
  },
  boxContext: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  img: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    width:'100%',
  },
  status: {
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
  },
  isSold: {
    backgroundColor: colors.success
  },
  isActive: {
    backgroundColor: colors.yellow
  },
  isExpired: {
    backgroundColor: colors.info
  },
  statusText:{
    color:'white'
  }
});

export default DropCard;
