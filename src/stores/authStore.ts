import { create } from 'zustand';
import { auth, onAuthStateChanged, getUserInfoFn } from '../lib/firebase';
import { signInWithToss } from '../lib/ensureAuth';
import type { User } from '../lib/firebase';

interface AuthStore {
  user: User | null;
  credits: number;
  loading: boolean;
  initialized: boolean;

  initialize: () => () => void;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  refreshCredits: () => Promise<void>;
  decrementCredits: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  credits: 0,
  loading: true,
  initialized: false,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      set({ user: firebaseUser, loading: false, initialized: true });
      
      if (firebaseUser) {
        get().refreshCredits();
      }
    });
    return unsubscribe;
  },

  login: async () => {
    set({ loading: true });
    try {
      const loggedInUser = await signInWithToss();
      set({ loading: false });
      return loggedInUser !== null;
    } catch {
      set({ loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await auth.signOut();
      set({ user: null, credits: 0 });
    } catch {
      /* expected: logout can fail silently */
    }
  },

  refreshCredits: async () => {
    if (!auth.currentUser) return;
    
    try {
      const result = await getUserInfoFn();
      set({ credits: result.data.credits });
    } catch {
      /* expected: keep existing credits on failure */
    }
  },

  decrementCredits: () => {
    set((state) => ({ credits: Math.max(0, state.credits - 1) }));
  },
}));
