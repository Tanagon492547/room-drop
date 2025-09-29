import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
import { getApp, getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const extra = Constants.expoConfig?.extra;

export const firebaseConfig = {
   apiKey: extra?.firebaseApiKey ?? "",
  authDomain: extra?.firebaseAuthDomain ?? "",
  projectId: extra?.firebaseProjectId ?? "",
  storageBucket: extra?.firebaseStorageBucket ?? "",
  messagingSenderId: extra?.firebaseMessagingSenderId ?? "",
  appId: extra?.firebaseAppId ?? "",
  measurementId: extra?.firebaseMeasurementId,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
