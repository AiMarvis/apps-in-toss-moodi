import { useAuthStore } from '../stores/authStore';
import type { User } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    loading,
    isLoggedIn: user !== null,
    login,
    logout,
  };
}
