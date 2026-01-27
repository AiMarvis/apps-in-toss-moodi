import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingAnimation } from '../components/common/LoadingAnimation';
import { useMusicGeneration } from '../hooks/useMusicGeneration';
import type { EmotionKeyword } from '../types/emotion';
import './LoadingPage.css';

interface LocationState {
  emotion: EmotionKeyword;
  emotionText?: string;
  instrumental?: boolean;
  musicType?: string;
  lyricsLanguage?: 'ko' | 'en';
}

/**
 * 로딩 페이지 - 음악 생성 진행 UI (PRD 4.1.5)
 * - 진행률 애니메이션
 * - 단계별 메시지
 * - 완료 시 플레이어로 이동
 */
export const LoadingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const { status, progress, track, error, generate, reset } = useMusicGeneration();

  const hasStartedRef = useRef(false);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    if (!state?.emotion) {
      navigate('/', { replace: true });
      return;
    }

    if (hasStartedRef.current) {
      return;
    }
    hasStartedRef.current = true;

    generate(state.emotion, state.emotionText, state.instrumental, state.musicType, state.lyricsLanguage);

    return () => {
      if (!hasNavigatedRef.current) {
        reset();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log('[LoadingPage] Status changed:', { 
      status, 
      hasTrack: !!track,
      trackId: track?.id,
      trackTitle: track?.title,
      audioUrl: track?.audioUrl,
    });
    
    if (status === 'complete' && track) {
      console.log('[LoadingPage] Navigating to /player with track:', {
        id: track.id,
        title: track.title,
        audioUrl: track.audioUrl,
        emotion: state?.emotion,
      });
      
      hasNavigatedRef.current = true;
      
      navigate('/player', {
        state: {
          track,
          emotion: state?.emotion,
          emotionText: state?.emotionText,
        },
        replace: true,
      });
    }
  }, [status, track, navigate, state?.emotion, state?.emotionText]);

  // 에러 발생 시
  const handleRetry = () => {
    if (state?.emotion) {
      reset();
      generate(state.emotion, state.emotionText, state.instrumental, state.musicType, state.lyricsLanguage);
    }
  };

  const handleGoBack = () => {
    navigate('/', { replace: true });
  };

  // 에러 상태 UI
  if (status === 'error') {
    return (
      <div className="loading-page error">
        <div className="error-container">
          <span className="error-icon">😔</span>
          <h2 className="error-title">앗, 문제가 생겼어요</h2>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button className="retry-button" onClick={handleRetry}>
              다시 시도하기
            </button>
            <button className="back-button" onClick={handleGoBack}>
              처음으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-page">
      <LoadingAnimation progress={progress} />
    </div>
  );
};

