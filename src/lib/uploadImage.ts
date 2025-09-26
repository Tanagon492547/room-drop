// src/lib/uploadImage.ts
import { storage } from '@/constants/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

/** Upload a local file:// URI to Firebase Storage and return its HTTPS URL */
export async function uploadImageAsync(localUri: string, path: string, contentType = 'image/jpeg') {
  // Expo-friendly: fetch -> blob
  const res = await fetch(localUri);
  const blob = await res.blob();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, { contentType });
  return await getDownloadURL(storageRef);
}

/** If uri is already https, return as-is; if file:// then upload using the provided builder */
export async function ensureUploaded(uri: string | null | undefined, buildPath: () => string) {
  if (!uri) return null;
  if (uri.startsWith('http')) return uri;
  if (uri.startsWith('file://')) {
    const path = buildPath();
    return await uploadImageAsync(uri, path);
  }
  // unknown scheme -> return as-is (or force upload if you want)
  return uri;
}
