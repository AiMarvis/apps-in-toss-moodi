import { useState, useCallback, useRef } from 'react';
import { generateMusic, checkAndSaveMusic } from '../api/musicApi';
import { ensureAuth } from '../lib/ensureAuth';
import { getErrorMessage, isCreditError, isAuthError } from '../utils/errorHandler';
import { useAuthStore } from '../stores/authStore';
import type { EmotionKeyword, Track } from '../types/emotion';

type GenerationStatus = 'idle' | 'generating' | 'processing' | 'complete' | 'error';

interface MusicGenerationState {
  status: GenerationStatus;
  progress: number;
  track: Track | null;
  error: string | null;
  generate: (emotion: EmotionKeyword, text?: string, instrumental?: boolean, musicType?: string, lyricsLanguage?: 'ko' | 'en') => Promise<void>;
  reset: () => void;
}

// 폴링 간격 (ms)
const POLLING_INTERVAL = 3000;
// 최대 폴링 횟수 (300초 = 5분 타임아웃)
const MAX_POLLING_COUNT = 100;

/**
 * 음악 생성 Hook
 * - Suno API 호출
 * - 상태 폴링
 * - 완료 시 Firebase Storage 저장
 */
export function useMusicGeneration(): MusicGenerationState {
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [track, setTrack] = useState<Track | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingCountRef = useRef(0);
  const isGeneratingRef = useRef(false);

  // 폴링 정리
  const clearPolling = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
    pollingCountRef.current = 0;
  }, []);

  // 상태 리셋
  const reset = useCallback(() => {
    clearPolling();
    isGeneratingRef.current = false;
    setStatus('idle');
    setProgress(0);
    setTrack(null);
    setError(null);
  }, [clearPolling]);

  const checkStatus = useCallback(
    async (taskId: string, emotion: EmotionKeyword, emotionText?: string) => {
      try {
        const data = await checkAndSaveMusic({
          taskId,
          emotion,
          emotionText,
        });

        if (data.status === 'complete' && data.track) {
          // 완료
          setStatus('complete');
          setProgress(100);
          setTrack(data.track);
          clearPolling();
        } else if (data.status === 'failed') {
          // 실패
          setStatus('error');
          setError('음악 생성에 실패했어요. 다시 시도해주세요.');
          clearPolling();
        } else {
          // 진행 중
          setProgress(data.progress || 50);
          
          // 폴링 횟수 체크
          pollingCountRef.current += 1;
          if (pollingCountRef.current >= MAX_POLLING_COUNT) {
            setStatus('error');
            setError('시간이 너무 오래 걸리고 있어요. 다시 시도해주세요.');
            clearPolling();
            return;
          }

          // 다음 폴링 예약
          pollingRef.current = setTimeout(() => {
            checkStatus(taskId, emotion, emotionText);
          }, POLLING_INTERVAL);
        }
      } catch (err) {
        setStatus('error');
        setError(getErrorMessage(err));
        clearPolling();
      }
    },
    [clearPolling]
  );

  const generate = useCallback(
    async (emotion: EmotionKeyword, text?: string, instrumental?: boolean, musicType?: string, lyricsLanguage?: 'ko' | 'en') => {
      // 이중 호출 방지: 이미 생성 중이면 스킵
      if (isGeneratingRef.current) {
        console.log('[useMusicGeneration] 이미 생성 중, 스킵');
        return;
      }
      isGeneratingRef.current = true;

      clearPolling();
      setStatus('generating');
      setProgress(10);
      setTrack(null);
      setError(null);

      try {
        await ensureAuth();

        const { taskId } = await generateMusic({ emotion, text, instrumental, musicType, lyricsLanguage });

        useAuthStore.getState().decrementCredits();

        setStatus('processing');
        setProgress(20);

        pollingRef.current = setTimeout(() => {
          checkStatus(taskId, emotion, text);
        }, POLLING_INTERVAL);
      } catch (err: unknown) {
        isGeneratingRef.current = false;
        setStatus('error');

        if (isCreditError(err)) {
          setError('크레딧이 부족해요. 내일 다시 시도해주세요!');
        } else if (isAuthError(err)) {
          setError('로그인에 실패했어요. 다시 시도해주세요.');
        } else {
          setError(getErrorMessage(err));
        }
      }
    },
    [clearPolling, checkStatus]
  );

  return { status, progress, track, error, generate, reset };
}
