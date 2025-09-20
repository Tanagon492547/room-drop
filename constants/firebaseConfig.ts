// constants/firebaseConfig.ts
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

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID, // optional
};

export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ ไม่ใช้ firebase/auth/react-native เลย
export const auth: Auth = getAuth(app);
export const db = getFirestore(app);

// 🔧 ตั้งค่า persistence ให้เหมาะกับแพลตฟอร์ม (ไม่มี react-native persistence)
if (Platform.OS === 'web') {
  // บนเว็บ: เก็บ session ไว้ใน localStorage
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} else {
  // บน Native: ใช้ in-memory (ผู้ใช้ต้องล็อกอินใหม่เมื่อเปิดแอปอีกครั้ง)
  setPersistence(auth, inMemoryPersistence).catch(() => {});
}
