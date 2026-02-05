import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertDialog } from '@toss/tds-mobile';
import { MusicPlayer } from '../components/player/MusicPlayer';
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
 * 
 * Note: 일기는 백엔드(sunoCallback)에서 자동 저장됨 - 중복 생성 방지
 */
export const PlayerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const [isAlertOpen, setIsAlertOpen] = useState(false);

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
        setIsAlertOpen(true);
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

      <AlertDialog
        open={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title="링크가 복사되었어요"
        description="친구들에게 음악을 공유해보세요!"
        alertButton={
          <AlertDialog.AlertButton onClick={() => setIsAlertOpen(false)}>
            확인
          </AlertDialog.AlertButton>
        }
      />
    </div>
  );
};

