import React, { useRef, useState, useEffect } from 'react';
import type { Track } from '../../types/emotion';
import { getEmotionById } from '../../constants/emotions';
import './MusicPlayer.css';

interface MusicPlayerProps {
  track: Track;
  onRegenerate?: () => void;
  onShare?: () => void;
}

/**
 * 음악 플레이어 컴포넌트 (PRD 5.3, component_guide.md 5.3)
 * - 앨범 아트 표시
 * - Play/Pause 버튼 (Seek 없음)
 * - 처음부터 다시 듣기
 * - 화면 유지 안내 배너
 */
export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  track,
  onRegenerate,
  onShare,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [imgError, setImgError] = useState(false);

  const emotion = getEmotionById(track.emotion);

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 프로그레스 바 클릭/터치로 이동
  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clickX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));

    audioRef.current.currentTime = percentage * duration;
  };

  // 재생/일시정지 토글
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 처음부터 다시 듣기
  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // 자동 재생 시도 (Autoplay policy로 인해 실패할 수 있음)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay 실패 - 사용자 인터랙션 필요
        setIsPlaying(false);
      });
    }
  }, [track.audioUrl]);

  return (
    <div className="music-player">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => {
          console.log('[MusicPlayer] Audio loaded, duration:', audioRef.current?.duration);
          setDuration(audioRef.current?.duration || track.duration);
        }}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          const audio = e.currentTarget;
          console.error('[MusicPlayer] Audio error:', {
            audioUrl: track.audioUrl,
            error: audio.error?.message,
            code: audio.error?.code,
            networkState: audio.networkState,
            readyState: audio.readyState,
          });
        }}
      />

      {/* Album Art */}
      <div
        className="album-art-container"
        style={{ '--emotion-color': emotion?.color } as React.CSSProperties}
      >
        {imgError || !track.albumArt ? (
          <div
            className="album-art-fallback"
            style={{ background: emotion?.gradient }}
          >
            <span className="fallback-emoji-large">{emotion?.emoji}</span>
          </div>
        ) : (
          <img
            src={track.albumArt}
            alt="앨범 아트"
            className="album-art"
            onError={() => setImgError(true)}
          />
        )}
        <div className="album-art-glow"></div>
      </div>

      {/* Track Info */}
      <div className="track-info">
        <h2 className="track-title">{track.title}</h2>
        <p className="track-description">{track.description}</p>
        <p className="ai-generated-notice">🤖 생성형 AI로 만든 곡입니다</p>
        {emotion && (
          <span className="track-emotion-tag" style={{ backgroundColor: emotion.color }}>
            {emotion.emoji} {emotion.label}
          </span>
        )}
      </div>

      {/* Progress Display with Seek */}
      <div className="progress-container">
        <div
          className="progress-bar"
          onClick={handleSeek}
          onTouchStart={handleSeek}
          role="slider"
          aria-label="재생 위치"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          tabIndex={0}
        >
          <div
            className="progress-fill"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Play/Pause Button */}
      <button className="play-button" onClick={handlePlayPause} aria-label={isPlaying ? '일시정지' : '재생'}>
        <span className="play-icon">{isPlaying ? '⏸️' : '▶️'}</span>
      </button>

      {/* Restart Button */}
      <button className="restart-button" onClick={handleRestart}>
        🔄 처음부터 다시 듣기
      </button>

      {/* Warning Banner */}
      <div className="warning-banner">
        <span className="warning-icon">💡</span>
        <span className="warning-text">
          화면을 켜 둔 상태에서 감상해주세요
          <br />
          <small>(화면이 꺼지면 음악이 멈춥니다)</small>
        </span>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {onShare && (
          <button className="action-button share-button" onClick={onShare}>
            공유하기
          </button>
        )}
        {onRegenerate && (
          <button className="action-button regenerate-button" onClick={onRegenerate}>
            다른 감정 이야기하기
          </button>
        )}
      </div>
    </div>
  );
};

