import { auth } from '@/constants/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';

// (Optional Firestore user profile)
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
const db = getFirestore();

export const subscribeToAuth = (cb: (u: User | null) => void) =>
  onAuthStateChanged(auth, cb); // fires on sign-up/sign-in/sign-out  [1](https://firebase.google.com/docs/auth/web/manage-users)

export const signUpWithEmail = async (email: string, password: string) => {
  // Basic pre-checks (UX)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('invalid-email');
  }
  if (password.length < 6) {
    throw new Error('weak-password');
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password); // creates + signs in  [1](https://firebase.google.com/docs/auth/web/manage-users)

    // Send verification email (non-blocking UX is fine; or await if you want)
    try {
      await sendEmailVerification(cred.user); // user must verify via email link  [6](https://jorgevergara.co/blog/send-email-verification/)
    } catch {}

    // Optional: create/update a Firestore profile document
    await setDoc(
      doc(db, 'users', cred.user.uid),
      {
        uid: cred.user.uid,
        email: cred.user.email ?? email,
        createdAt: serverTimestamp(),
        emailVerified: cred.user.emailVerified,
      },
      { merge: true }
    );

    return cred.user;
  } catch (err: any) {
    // Normalize common Firebase errors for your UI
    const code = err?.code || err?.message;
    if (code === 'auth/email-already-in-use') {
      // Suggest sign-in or password reset
      throw new Error('email-already-in-use');
    }
    if (code === 'auth/invalid-email') throw new Error('invalid-email');
    if (code === 'auth/weak-password') throw new Error('weak-password');
    throw err;
  }
};

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOutUser = () => signOut(auth);
