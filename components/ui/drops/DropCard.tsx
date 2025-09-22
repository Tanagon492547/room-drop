import { colors } from '@/constants/Colors';
import { auth, db } from '@/constants/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import DropImageCard from '../DropImageCard';

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

type ListItem = {
  id: string;
  name: string;        // hotel_name
  location: string;    // hotel_location
  checkIn: string;     // room_date_checkIn
  checkOut: string;    // room_date_checkOut
  url: string;         // prefer room_photoURL, fallback to hotel_photoURL
};

const handleEdit = (item: ListItem) => {
  Alert.alert('แก้ไข', `คุณกำลังจะแก้ไข: ${item.name}`);
};

const handleDelete = (item: ListItem) => {
  Alert.alert('ลบ', `คุณแน่ใจหรือไม่ว่าจะลบ: ${item.name}`);
  // (Optional) delete logic here
};

const DropCard = () => {
  const [listData, setListData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // derive the current user id
  const uid = useMemo(() => auth.currentUser?.uid ?? null, []);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    // listen to rooms for current user
    const q = query(collection(db, 'rooms'), where('user_id', '==', uid));
    const unsub = onSnapshot(
      q,
      async (snap) => {
        try {
          // fetch all related hotel docs (by hotel_id) and merge
          const rooms = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

          // build a unique set of hotel_ids
          const hotelIds = Array.from(new Set(rooms.map((r) => r.hotel_id).filter(Boolean)));

          // fetch all hotel docs in parallel
          const hotelDocs = await Promise.all(
            hotelIds.map(async (hid) => {
              const hSnap = await getDoc(doc(db, 'hotels', hid));
              return { id: hid, data: hSnap.exists() ? hSnap.data() : null };
            })
          );

          // map for quick lookup
          const hotelMap = new Map<string, any>(
            hotelDocs.map((h) => [h.id, h.data])
          );

          // build list items for your UI
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

  if (loading) {
    return (
      <View style={[styles.visibleItem, { justifyContent: 'center', height: 120 }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SwipeListView
      data={listData}
      // visible card
      renderItem={({ item }) => (
        <View style={styles.visibleItem}>
          <View>
            <DropImageCard url={item.url} />
          </View>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.p}>{item.location}</Text>
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
      // hidden menu
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
      keyExtractor={(item) => item.id}
      rightOpenValue={-150}
      disableRightSwipe
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
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    height: 165,
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
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
});

export default DropCard;
