import { create } from 'zustand';
import { auth, onAuthStateChanged, getUserInfoFn } from '../lib/firebase';
import { signInWithToss } from '../lib/ensureAuth';
import { restorePendingIapOrders } from '../lib/iapRestore';
import { getIsTossLoginIntegratedService } from '@apps-in-toss/web-framework';
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
    // visibility change 리스너 - 앱이 포그라운드로 돌아올 때 연동 상태 확인
    const handleVisibilityChange = async () => {
      if (document.visibilityState !== 'visible') return;

      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.uid.startsWith('toss_')) return;

      try {
        const isLinked = await getIsTossLoginIntegratedService();
        if (isLinked === false) {
          // 연동 해제된 경우 자동 로그아웃
          await auth.signOut();
          set({ user: null, credits: 0, loading: false, initialized: true });
        }
      } catch (error) {
        // 연동 상태 확인 실패 시 로깅 후 정상 진행
        console.error('[AuthStore] visibility change - 연동 상태 확인 실패:', error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // 토스 사용자인 경우 연동 상태 확인
      if (firebaseUser && firebaseUser.uid.startsWith('toss_')) {
        try {
          const isLinked = await getIsTossLoginIntegratedService();
          if (isLinked === false) {
            // 연동 해제된 경우 자동 로그아웃
            await auth.signOut();
            set({ user: null, credits: 0, loading: false, initialized: true });
            return;
          }
        } catch (error) {
          // 연동 상태 확인 실패 시 로깅 후 정상 진행
          console.error('[AuthStore] 연동 상태 확인 실패:', error);
        }
      }

      set({ user: firebaseUser, loading: false, initialized: true });

      if (firebaseUser) {
        get().refreshCredits();
        // 미완료 주문 복원 (백그라운드에서 조용히 처리)
        restorePendingIapOrders().catch(() => {
          /* 복원 실패는 무시 - 다음 접속 시 재시도 */
        });
      }
    });

    // cleanup 함수: 두 리스너 모두 정리
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
    };
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
