// firebase/auth.ts
import { firebaseConfig } from '@/constants/firebaseConfig'; // <- ใช้ config เดิม
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  browserLocalPersistence,
  getAuth,
  inMemoryPersistence,
  setPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

// สร้าง/ดึงแอปเดียว
export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ ไม่แตะ react-native subpath เลย
export const auth: Auth = getAuth(app);
export const db = getFirestore(app);

// ตั้ง persistence ให้เหมาะกับแพลตฟอร์ม
if (Platform.OS === 'web') {
  // บนเว็บ: เก็บ session ใน localStorage
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} else {
  // บน Native: in-memory (เปิดแอปใหม่ต้องล็อกอินอีกครั้ง)
  setPersistence(auth, inMemoryPersistence).catch(() => {});
}
