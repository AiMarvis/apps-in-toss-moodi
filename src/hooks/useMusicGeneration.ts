import { useState, useCallback, useRef, useEffect } from 'react';
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

const POLLING_INTERVAL = 3000;
const MAX_POLLING_COUNT = 100;

export function useMusicGeneration(): MusicGenerationState {
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [track, setTrack] = useState<Track | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingCountRef = useRef(0);
  const isGeneratingRef = useRef(false);
  const checkStatusRef = useRef<((taskId: string, emotion: EmotionKeyword, emotionText?: string) => Promise<void>) | null>(null);

  const clearPolling = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
    pollingCountRef.current = 0;
  }, []);

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
        console.log('[useMusicGeneration] Checking status for taskId:', taskId);
        const data = await checkAndSaveMusic({
          taskId,
          emotion,
          emotionText,
        });
        
        console.log('[useMusicGeneration] checkAndSaveMusic response:', {
          status: data.status,
          hasTrack: !!data.track,
          trackId: data.track?.id,
          audioUrl: data.track?.audioUrl,
          progress: data.progress,
        });

        if (data.status === 'complete' && data.track) {
          setStatus('complete');
          setProgress(100);
          setTrack(data.track);
          clearPolling();
        } else if (data.status === 'failed') {
          setStatus('error');
          setError('음악 생성에 실패했어요. 다시 시도해주세요.');
          clearPolling();
        } else {
          setProgress(data.progress || 50);
          
          pollingCountRef.current += 1;
          if (pollingCountRef.current >= MAX_POLLING_COUNT) {
            setStatus('error');
            setError('시간이 너무 오래 걸리고 있어요. 다시 시도해주세요.');
            clearPolling();
            return;
          }

          pollingRef.current = setTimeout(() => {
            checkStatusRef.current?.(taskId, emotion, emotionText);
          }, POLLING_INTERVAL);
        }
      } catch (err) {
        console.error('[useMusicGeneration] checkAndSaveMusic error:', err);
        setStatus('error');
        setError(getErrorMessage(err));
        clearPolling();
      }
    },
    [clearPolling]
  );

  useEffect(() => {
    checkStatusRef.current = checkStatus;
  }, [checkStatus]);

  const generate = useCallback(
    async (emotion: EmotionKeyword, text?: string, instrumental?: boolean, musicType?: string, lyricsLanguage?: 'ko' | 'en') => {
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
          checkStatusRef.current?.(taskId, emotion, text);
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
    [clearPolling]
  );

  return { status, progress, track, error, generate, reset };
}
