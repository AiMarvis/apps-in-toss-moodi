import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MusicPlayer } from '../components/player/MusicPlayer';
import type { Track } from '../types/emotion';
import './PlayerPage.css';

interface LocationState {
  track: Track;
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

  // 트랙 정보 없으면 홈으로
  if (!state?.track) {
    navigate('/', { replace: true });
    return null;
  }

  const { track } = state;

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

