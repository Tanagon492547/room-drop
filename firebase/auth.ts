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

export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db = getFirestore(app);

if (Platform.OS === 'web') {
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} else {
  setPersistence(auth, inMemoryPersistence).catch(() => {});
}
