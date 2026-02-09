import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { share, getTossShareLink } from '@apps-in-toss/web-framework';
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
      const tossLink = await getTossShareLink('intoss://my-moodi');
      await share({ message: `Moodi가 내 기분에 맞는 음악을 만들어줬어요! 🎵\n${tossLink}` });
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

