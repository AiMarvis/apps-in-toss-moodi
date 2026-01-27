import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MusicPlayer } from '../components/player/MusicPlayer';
import { useDiary } from '../hooks/useDiary';
import type { Track, EmotionKeyword } from '../types/emotion';
import './PlayerPage.css';

interface LocationState {
  track: Track;
  emotion?: EmotionKeyword;
  emotionText?: string;
}

/**
 * 플레이어 페이지 - 음악 재생 UI (PRD 5.3)
 * - 앨범 아트
 * - Play/Pause
 * - 화면 유지 안내
 */
export const PlayerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const { addDiary } = useDiary();
  const diarySavedRef = useRef(false);

  // 디버깅: location.state 확인
  console.log('[PlayerPage] Mounted with location.state:', {
    hasState: !!state,
    hasTrack: !!state?.track,
    trackId: state?.track?.id,
    trackTitle: state?.track?.title,
    audioUrl: state?.track?.audioUrl,
    emotion: state?.emotion,
  });

  const track = state?.track;
  const emotion = state?.emotion;
  const emotionText = state?.emotionText;

  useEffect(() => {
    if (!track) return;
    if (diarySavedRef.current) return;
    if (!emotion) return;

    const saveDiary = async () => {
      const now = new Date();
      const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
      const today = kstDate.toISOString().split('T')[0];
      console.log('[PlayerPage] Saving diary for trackId:', track.id);
      
      try {
        const result = await addDiary({
          date: today,
          emotion,
          content: emotionText || track.description,
          trackId: track.id,
        });
        
        if (result) {
          diarySavedRef.current = true;
          console.log('[PlayerPage] Diary saved successfully:', result.id);
        } else {
          console.error('[PlayerPage] addDiary returned null');
        }
      } catch (err) {
        console.error('[PlayerPage] Failed to save diary:', err);
      }
    };

    saveDiary();
  }, [track, emotion, emotionText, addDiary]);

  // 트랙 정보 없으면 홈으로
  if (!track) {
    navigate('/', { replace: true });
    return null;
  }

  const handleRegenerate = () => {
    navigate('/', { replace: true });
  };

  const handleShare = async () => {
    try {
      // Web Share API 사용 (지원되는 경우)
      if (navigator.share) {
        await navigator.share({
          title: track.title,
          text: `Moodi가 내 기분에 맞는 음악을 만들어줬어요! 🎵\n${track.description}`,
          url: window.location.href,
        });
      } else {
        // 클립보드에 복사
        await navigator.clipboard.writeText(
          `Moodi가 내 기분에 맞는 음악을 만들어줬어요! 🎵\n${track.title} - ${track.description}`
        );
        alert('링크가 복사되었어요!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <div className="player-page">
      {/* Header */}
      <header className="player-header">
        <button className="back-button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          ←
        </button>
        <h1 className="player-title">나만의 음악</h1>
        <div className="header-spacer" />
      </header>

      {/* Player */}
      <main className="player-content">
        <MusicPlayer
          track={track}
          onRegenerate={handleRegenerate}
          onShare={handleShare}
        />
      </main>
    </div>
  );
};

