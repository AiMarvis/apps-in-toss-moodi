import { useState, useEffect, useCallback } from 'react';
import { getUserInfoFn } from '../lib/firebase';
import { isAuthenticated } from '../lib/ensureAuth';

interface CreditsState {
  credits: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 크레딧 관리 Hook
 * - Firebase에서 사용자 크레딧 조회
 * - Lazy Auth: 로그인되어 있을 때만 조회
 * - 새로고침 기능
 */
export function useCredits(): CreditsState {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    // Lazy Auth: 로그인되어 있을 때만 크레딧 조회
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getUserInfoFn();
      setCredits(result.data.credits);
    } catch (err) {
      console.error('크레딧 조회 실패:', err);
      setError('크레딧 정보를 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return { credits, loading, error, refetch: fetchCredits };
}
