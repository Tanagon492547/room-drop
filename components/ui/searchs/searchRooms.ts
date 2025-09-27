// services/searchRooms.ts
import {
    collection,
    DocumentData,
    getDocs, getFirestore,
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

  // 1) คิวรี candidate rooms
  const constraints: QueryConstraint[] = [
    where('room_status', '==', 1),
  ];

  if (typeof minPrice === 'number' || typeof maxPrice === 'number') {
    constraints.push(
      where('room_price', '>=', typeof minPrice === 'number' ? minPrice : 0),
      where('room_price', '<=', typeof maxPrice === 'number' ? maxPrice : 9_999_999)
    );
  }

  if (location && location.trim()) {
    // ต้องมี rooms.hotel_location (denormalize)
    constraints.push(where('hotel_location', '==', location.trim()));
  }

  // เรียง+เพจจิ้ง (เลือกคีย์เรียงที่มีดัชนี เช่น room_price หรือ createdAt)
  constraints.push(orderBy('room_price', 'asc'));
  constraints.push(limit(pageSize));
  if (pageCursor) constraints.push(startAfter(pageCursor));

  const roomsSnap = await getDocs(query(collection(db, 'rooms'), ...constraints));

  // 2) สำหรับแต่ละ room ตรวจ overlap booking (waiting|approved) — filter ฝั่ง client
  const out: { rooms: Room[]; last: DocumentData | null } = { rooms: [], last: null };

  for (const doc of roomsSnap.docs) {
    const r = { room_id: doc.id, ...doc.data() } as unknown as Room;

    // ถาม bookings ของห้องนี้ที่อาจทับช่วง (query แบบ 2 inequality + สถานะ)
    const bookingsQ = query(
      collection(db, 'bookings'),
      where('room_id', '==', r.room_id),
      where('booking_status', 'in', [0, 1]),
      // overlap: check_in < req_checkOut AND check_out > req_checkIn
      where('check_in', '<', checkOut),
      where('check_out', '>', checkIn)
    );

    const bSnap = await getDocs(bookingsQ);

    // ถ้ามีอย่างน้อย 1 record → ทับช่วง → ไม่นำเข้าผลลัพธ์
    if (!bSnap.empty) {
      // safety ชั้นสุดท้าย เผื่อ device เวลาไม่ตรง
      const blocking = bSnap.docs.some(bd => {
        const b = bd.data();
        return rangesOverlap(
          b.check_in.toDate?.() ?? new Date(b.check_in),
          b.check_out.toDate?.() ?? new Date(b.check_out),
          checkIn, checkOut
        );
      });
      if (blocking) continue;
    }

    out.rooms.push(r);
  }

  out.last = roomsSnap.docs.length ? roomsSnap.docs[roomsSnap.docs.length - 1] : null;
  return out; // { rooms, last } → เอา last ไปเป็น pageCursor ครั้งถัดไป
}
