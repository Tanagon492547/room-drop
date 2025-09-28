// DropCard.tsx
import { colors } from '@/constants/Colors';
import { auth, db, storage } from '@/constants/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
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
  pendingBookingId?: string | null;
  pendingCount?: number;
  status?: number;     // 0=sold out, 1=available, 2=out of date
};

const DropCard = () => {
  const [listData, setListData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const uid = useMemo(() => auth.currentUser?.uid ?? null, []);

  async function safeDeleteFile(url?: string | null) {
    if (!url || typeof url !== 'string') return;
    if (!url.startsWith('http')) return; // skip local file://
    try {
      await deleteObject(ref(storage, url)); // accepts https or gs://
    } catch (e: any) {
      console.log('safeDeleteFile skip:', e?.code || e?.message || e);
    }
  }

  // Firestore "in" supports up to 10 values
  const chunk = <T,>(arr: T[], size = 10): T[][] => {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const qRooms = query(collection(db, 'rooms'), where('user_id', '==', uid));
    const unsub = onSnapshot(
      qRooms,
      async (snap) => {
        try {
          const rooms = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

          // collect hotels
          const hotelIds = Array.from(new Set(rooms.map((r) => r.hotel_id).filter(Boolean)));
          const hotelDocs = await Promise.all(
            hotelIds.map(async (hid) => {
              const hSnap = await getDoc(doc(db, 'hotels', hid));
              return { id: hid, data: hSnap.exists() ? hSnap.data() : null };
            })
          );
          const hotelMap = new Map<string, any>(hotelDocs.map((h) => [h.id, h.data]));

          // collect pending bookings for these rooms (booking_status == 0)
          const roomIds = rooms.map((r) => r.id);
          const roomIdChunks = chunk(roomIds, 10);
          const pendingMap = new Map<string, { firstId: string; count: number }>();

          await Promise.all(
            roomIdChunks.map(async (ids) => {
              if (!ids.length) return;
              const qPending = query(
                collection(db, 'bookings'),
                where('room_id', 'in', ids),
                where('booking_status', '==', 0)
              );
              const pSnap = await getDocs(qPending);
              const grouped: Record<string, string[]> = {};
              pSnap.forEach((b) => {
                const data = b.data() as any;
                const rid: string = data.room_id;
                (grouped[rid] ||= []).push(b.id);
              });
              Object.entries(grouped).forEach(([rid, ids]) => {
                pendingMap.set(rid, { firstId: ids[0], count: ids.length });
              });
            })
          );

          // build items
          const items: ListItem[] = rooms.map((r) => {
            const hotel = r.hotel_id ? hotelMap.get(r.hotel_id) : null;
            const pending = pendingMap.get(r.id);

            // Coerce status (handles "0"/"1"/"2" strings)
            const rawStatus = r.room_status;
            const statusNum = Number(rawStatus);
            const status = Number.isFinite(statusNum) ? statusNum : 1; // default available

            return {
              id: r.id,
              name: r.hotel_name || hotel?.hotel_name || 'Unknown Hotel',
              location: hotel?.hotel_location || r.hotel_location || '-',
              checkIn: r.room_date_checkIn || '',
              checkOut: r.room_date_checkOut || '',
              url: r.room_photoURL || hotel?.hotel_photoURL || '',
              pendingBookingId: pending?.firstId ?? null,
              pendingCount: pending?.count ?? 0,
              status,
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
              const roomRef = doc(db, 'rooms', item.id);
              const roomSnap = await getDoc(roomRef);
              if (!roomSnap.exists()) {
                await deleteDoc(roomRef);
                return;
              }
              const room = roomSnap.data() as any;
              const roomPhotoURL: string | undefined = room.room_photoURL;
              const roomBillURL: string | undefined = room.room_bill;
              const hotelId: string | undefined = room.hotel_id;

              let isLastRoomForHotel = false;
              let hotelCoverURL: string | undefined;

              if (hotelId) {
                const sibsSnap = await getDocs(query(collection(db, 'rooms'), where('hotel_id', '==', hotelId)));
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

              await Promise.allSettled([
                safeDeleteFile(roomPhotoURL),
                safeDeleteFile(roomBillURL),
              ]);

              await deleteDoc(roomRef);

              if (hotelId && isLastRoomForHotel) {
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
  const goApprove = (item: ListItem) => {
    if (!item.pendingBookingId) return;
    router.push({
      pathname: '/(app)/(tabs)/confirmPayment',
      params: { roomId: item.id, bookingId: item.pendingBookingId },
    });
  };

  const renderStatusPill = (status?: number) => {
    // 0 = sold out (green), 1 = available (gray), 2 = out of date (red)
    let label = 'Available';
    let bg = '#9CA3AF';   // gray
    if (status === 0) {
      label = 'Sold out';
      bg = '#16A34A';     // green
    } else if (status === 2) {
      label = 'Out of date';
      bg = '#EF4444';     // red
    }
    return (
      <View style={[styles.statusPill, { backgroundColor: bg }]}>
        <Text style={styles.statusText}>{label}</Text>
      </View>
    );
  };

  return (
    <SwipeListView
      data={listData}
      renderItem={({ item }) => (
        <View style={styles.visibleItem}>
          <View style={styles.img}>
            <DropImageCard url={item.url} height={125} />
          </View>
          <View style={{ width: 140 }}>
            {renderStatusPill(item.status)}
            <Text style={[styles.p, ]}>
                {item.name}
              </Text>
            <Pressable  style={[styles.status]}>
              <View style={styles.rowBetween}>
                <Text style={styles.p} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
            </Pressable>
              <View style={{ gap: 1 }}>
                <View style={[styles.boxContext]}>
                  <FontAwesome name="calendar-check-o" size={20} color="#000000ff" />
                  <Text style={styles.p2}>{item.checkIn}</Text>
                </View>
                <View style={[styles.boxContext]}>
                  <FontAwesome name="calendar-times-o" size={20} color="#000000ff" />
                  <Text style={styles.p2}>{item.checkOut}</Text>
                </View>
              </View>

              {/* Approve button only when there is at least one pending booking */}
              {item.pendingCount && item.pendingCount > 0 ? (
                <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => goApprove(item)}>
                    <Text style={styles.approveText}>
                      {item.pendingCount > 1 ? `Approve (${item.pendingCount})` : 'Approve'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
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
      alignItems: 'center',
        width: '100%',
  },
  status: {
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor:'#b3c4ffff'
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
  // statusText: {
  //   color: 'white'
  // },
  // new: location + status row
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // new: status pill
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  // existing: approve button
  approveBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  approveText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
  },
});

export default DropCard;


