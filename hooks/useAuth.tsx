import { auth } from '@/firebase/auth';
import {
  signOut as fbSignOut,
  getIdToken,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Ctx = {
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  session?: string | null; // <-- คงชื่อเดิม: ใช้เก็บ idToken
  isLoading: boolean;
  user?: User | null;      // <-- ของแถมถ้าต้องใช้
};

const AuthContext = createContext<Ctx>({
  signIn: async () => { throw new Error('AuthContext not ready'); },
  signOut: async () => {},
  session: null,
  isLoading: true,
  user: null,
});

export function useSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useSession must be wrapped in a <SessionProvider />');
  return ctx;
}

export function SessionProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<string | null>(null); // idToken
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u ?? null);
      if (u) {
        const token = await getIdToken(u, false);
        setSession(token);
      } else {
        setSession(null);
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo<Ctx>(() => ({
    signIn: async (email: string, password: string) => {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      setSession(token);
      return cred.user;
    },
    signOut: async () => {
      await fbSignOut(auth);
      setSession(null);
    },
    session,    // string|null
    isLoading,
    user,
  }), [session, isLoading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
