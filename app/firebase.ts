// install with
// npx install @react-native-firebase/app  
// npx install @react-native-firebase/auth
// npx expo install firebase @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth = (() => {
  if (Platform.OS === 'web') {
    // Use default web persistence (no imports of browserLocalPersistence)
    return getAuth(app);
  }
  // Native: persist with AsyncStorage
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
})();

export { app, auth };

