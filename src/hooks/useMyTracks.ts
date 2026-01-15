import { useState, useCallback } from 'react';
import { getMyTracksFn, deleteTrackFn } from '../lib/firebase';
import { ensureAuth } from '../lib/ensureAuth';
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
      // Lazy Auth: Firebase 기능 사용 전 인증 보장
      await ensureAuth();

      const result = await getMyTracksFn({
        limit: PAGE_SIZE,
        startAfter: reset ? undefined : lastTrackId,
      });

      const newTracks = result.data.tracks;

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
      console.error('트랙 목록 조회 실패:', err);
      if (err && typeof err === 'object' && 'message' in err) {
        const errorMessage = (err as { message: string }).message;
        if (errorMessage.includes('로그인')) {
          setError('로그인에 실패했어요. 다시 시도해주세요.');
        } else {
          setError('음악 목록을 불러오지 못했어요.');
        }
      } else {
      setError('음악 목록을 불러오지 못했어요.');
      }
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
    try {
      // Lazy Auth: Firebase 기능 사용 전 인증 보장
      await ensureAuth();

      await deleteTrackFn({ trackId });
      
      // 로컬 상태에서도 제거
      setTracks((prev) => prev.filter((t) => t.id !== trackId));
      
      return true;
    } catch (err) {
      console.error('트랙 삭제 실패:', err);
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
