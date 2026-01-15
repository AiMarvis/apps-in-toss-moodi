import { useEffect, useState, useCallback } from 'react';
import { auth, onAuthStateChanged } from '../lib/firebase';
import { signInWithToss } from '../lib/ensureAuth';
import type { User } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const loggedInUser = await signInWithToss();
      setLoading(false);
      return loggedInUser !== null;
    } catch (err) {
      console.error('[useAuth] 로그인 실패:', err);
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error('[useAuth] 로그아웃 실패:', err);
    }
  }, []);

  return { 
    user, 
    loading, 
    isLoggedIn: user !== null,
    login,
    logout
  };
}
