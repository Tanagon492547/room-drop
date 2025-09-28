import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  where
} from 'firebase/firestore';

export type SearchParams = {
  location?: string;      // จังหวัด หรือ "เมือง, จังหวัด"
  checkIn: Date;          // จาก DatePicker
  checkOut: Date;         // จาก DatePicker
  minPrice?: number;
  maxPrice?: number;
  pageSize?: number;      // default 20
  pageCursor?: DocumentData | null; // ใช้ documentSnapshot ของหน้าก่อนหน้า
};

export type Room = {
  room_id: string;
  room_name: string;
  room_description?: string;
  room_price: number;
  room_photoURL?: string;
  room_status: number;
  hotel_id: string;
  hotel_name: string;
  hotel_location?: string;
};

const db = getFirestore();

// helper overlap: (start1 < end2) && (end1 > start2)
function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && aEnd > bStart;
}

export async function searchRoomsFirebase(params: SearchParams) {
  const {
    location, checkIn, checkOut,
    minPrice, maxPrice, pageSize = 20, pageCursor = null
  } = params;

  // --- Step 1: query candidate rooms ---
  const constraints: QueryConstraint[] = [
    where('room_status', '==', 1),  // 1 = available
  ];

  if (typeof minPrice === 'number' || typeof maxPrice === 'number') {
    constraints.push(
      where('room_price', '>=', typeof minPrice === 'number' ? minPrice : 0),
      where('room_price', '<=', typeof maxPrice === 'number' ? maxPrice : 9_999_999)
    );
  }

  if (location && location.trim()) {
    // ต้องมี field hotel_location ใน rooms
    constraints.push(where('hotel_location', '==', location.trim()));
  }

  constraints.push(orderBy('room_price', 'asc'));
  constraints.push(limit(pageSize));
  if (pageCursor) constraints.push(startAfter(pageCursor));

  const roomsSnap = await getDocs(query(collection(db, 'rooms'), ...constraints));

  const out: { rooms: Room[]; last: DocumentData | null } = { rooms: [], last: null };

  // --- Step 2: check booking overlap ---
  for (const doc of roomsSnap.docs) {
    const data = doc.data();

    const r: Room = {
      room_id: doc.id,
      room_name: data.room_name,
      room_description: data.room_description,
      room_price: data.room_price,
      room_photoURL: data.room_photoURL,
      room_status: data.room_status,
      hotel_id: data.hotel_id,
      hotel_name: data.hotel_name,
      hotel_location: data.hotel_location,
    };

    // query bookings ของห้องนี้
    const bookingsQ = query(
      collection(db, 'bookings'),
      where('room_id', '==', r.room_id),
      where('booking_status', 'in', [0, 1]),   // 0 = waiting, 1 = approved
      where('check_in', '<', checkOut),
      where('check_out', '>', checkIn)
    );

    const bSnap = await getDocs(bookingsQ);

    if (!bSnap.empty) {
      const blocking = bSnap.docs.some(bd => {
        const b = bd.data();
        return rangesOverlap(
          b.check_in.toDate?.() ?? new Date(b.check_in),
          b.check_out.toDate?.() ?? new Date(b.check_out),
          checkIn, checkOut
        );
      });
      if (blocking) continue; // ❌ booked → ข้ามห้องนี้
    }

    out.rooms.push(r);
  }

  out.last = roomsSnap.docs.length ? roomsSnap.docs[roomsSnap.docs.length - 1] : null;
  return out;
}
