import { useState, useCallback } from 'react';
import { getMyTracks, deleteTrack as deleteTrackApi } from '../api/trackApi';
import { auth } from '../lib/firebase';
import { getErrorMessage } from '../utils/errorHandler';
import type { Track } from '../types/emotion';

interface MyTracksState {
  tracks: Track[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchTracks: (reset?: boolean) => Promise<void>;
  deleteTrack: (trackId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

const PAGE_SIZE = 20;

/**
 * 내 음악 목록 관리 Hook
 * - 페이지네이션 지원
 * - 삭제 기능
 */
export function useMyTracks(): MyTracksState {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastTrackId, setLastTrackId] = useState<string | undefined>();

  // 트랙 목록 가져오기
  const fetchTracks = useCallback(async (reset = false) => {
    setLoading(true);
    setError(null);

    try {
      // 로그인 안 되어 있으면 빈 목록 유지 (자동 로그인 X)
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      console.log('[useMyTracks] 인증된 사용자:', user.uid);

      const result = await getMyTracks({
        limit: PAGE_SIZE,
        startAfter: reset ? undefined : lastTrackId,
      });

      console.log('[useMyTracks] 조회된 트랙 수:', result.tracks.length, result.tracks);
      const newTracks = result.tracks;

      if (reset) {
        setTracks(newTracks);
      } else {
        setTracks((prev) => [...prev, ...newTracks]);
      }

      // 더 불러올 데이터가 있는지 확인
      setHasMore(newTracks.length === PAGE_SIZE);

      // 마지막 트랙 ID 저장
      if (newTracks.length > 0) {
        setLastTrackId(newTracks[newTracks.length - 1].id);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [lastTrackId]);

  // 새로고침
  const refetch = useCallback(async () => {
    setLastTrackId(undefined);
    setHasMore(true);
    await fetchTracks(true);
  }, [fetchTracks]);

  // 트랙 삭제
  const deleteTrack = useCallback(async (trackId: string): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) {
      setError('로그인이 필요합니다.');
      return false;
    }

    try {
      await deleteTrackApi(trackId);
      
      // 로컬 상태에서도 제거
      setTracks((prev) => prev.filter((t) => t.id !== trackId));
      
      return true;
    } catch {
      setError('삭제에 실패했어요.');
      return false;
    }
  }, []);

  return {
    tracks,
    loading,
    error,
    hasMore,
    fetchTracks,
    deleteTrack,
    refetch,
  };
}
