import { useAuthStore } from '../stores/authStore';

interface CreditsState {
  credits: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCredits(): CreditsState {
  const credits = useAuthStore((state) => state.credits);
  const loading = useAuthStore((state) => state.loading);
  const refreshCredits = useAuthStore((state) => state.refreshCredits);

  return {
    credits,
    loading,
    error: null,
    refetch: refreshCredits,
  };
}
