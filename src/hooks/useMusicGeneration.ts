import { useState, useCallback, useRef } from 'react';
import { generateMusicFn, checkAndSaveMusicFn } from '../lib/firebase';
import { ensureAuth } from '../lib/ensureAuth';
import type { EmotionKeyword, Track } from '../types/emotion';

type GenerationStatus = 'idle' | 'generating' | 'processing' | 'complete' | 'error';

interface MusicGenerationState {
  status: GenerationStatus;
  progress: number;
  track: Track | null;
  error: string | null;
  generate: (emotion: EmotionKeyword, text?: string) => Promise<void>;
  reset: () => void;
}

// 폴링 간격 (ms)
const POLLING_INTERVAL = 3000;
// 최대 폴링 횟수 (90초 타임아웃)
const MAX_POLLING_COUNT = 30;

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
    setStatus('idle');
    setProgress(0);
    setTrack(null);
    setError(null);
  }, [clearPolling]);

  // 상태 확인 및 저장
  const checkStatus = useCallback(
    async (taskId: string, emotion: EmotionKeyword, emotionText?: string) => {
      try {
        const result = await checkAndSaveMusicFn({
          taskId,
          emotion,
          emotionText,
        });

        const data = result.data;

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
        console.error('상태 확인 실패:', err);
        setStatus('error');
        setError('상태 확인에 실패했어요. 다시 시도해주세요.');
        clearPolling();
      }
    },
    [clearPolling]
  );

  // 음악 생성 시작
  const generate = useCallback(
    async (emotion: EmotionKeyword, text?: string) => {
      // 초기화
      clearPolling();
      setStatus('generating');
      setProgress(10);
      setTrack(null);
      setError(null);

      try {
        // Lazy Auth: Firebase 기능 사용 전 인증 보장
        await ensureAuth();

        // 생성 요청
        const result = await generateMusicFn({ emotion, text });
        const { taskId } = result.data;

        // 상태를 processing으로 변경
        setStatus('processing');
        setProgress(20);

        // 폴링 시작
        pollingRef.current = setTimeout(() => {
          checkStatus(taskId, emotion, text);
        }, POLLING_INTERVAL);
      } catch (err: unknown) {
        console.error('음악 생성 요청 실패:', err);
        setStatus('error');
        
        // 에러 메시지 추출
        if (err && typeof err === 'object' && 'message' in err) {
          const errorMessage = (err as { message: string }).message;
          if (errorMessage.includes('크레딧')) {
            setError('크레딧이 부족해요. 내일 다시 시도해주세요!');
          } else if (errorMessage.includes('로그인')) {
            setError('로그인에 실패했어요. 다시 시도해주세요.');
          } else {
            setError('음악 생성에 실패했어요. 다시 시도해주세요.');
          }
        } else {
          setError('음악 생성에 실패했어요. 다시 시도해주세요.');
        }
      }
    },
    [clearPolling, checkStatus]
  );

  return { status, progress, track, error, generate, reset };
}
