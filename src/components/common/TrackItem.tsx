import React from 'react';
import type { Track } from '../../types/emotion';
import { getEmotionById } from '../../constants/emotions';
import './TrackItem.css';

interface TrackItemProps {
  track: Track;
  onClick?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

/**
 * 트랙 목록 아이템 컴포넌트
 * - 앨범 아트 썸네일
 * - 제목, 설명
 * - 감정 태그
 * - 삭제 버튼 (선택적)
 */
export const TrackItem: React.FC<TrackItemProps> = ({
  track,
  onClick,
  onDelete,
  showDelete = false,
}) => {
  const emotion = getEmotionById(track.emotion);

  // 생성 시간 포맷팅
  const formatDate = (date: Date) => {
    const now = new Date();
    const trackDate = new Date(date);
    const diff = now.getTime() - trackDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;
    
    return trackDate.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div className="track-item" onClick={onClick} role="button" tabIndex={0}>
      {/* 썸네일 */}
      <div className="track-thumbnail">
        <img src={track.albumArt} alt="" />
        {emotion && (
          <div 
            className="track-emotion-badge" 
            style={{ backgroundColor: emotion.color }}
          >
            {emotion.emoji}
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="track-content">
        <h3 className="track-title">{track.title}</h3>
        <p className="track-description">{track.description}</p>
        <span className="track-date">{formatDate(track.createdAt)}</span>
      </div>

      {/* 삭제 버튼 */}
      {showDelete && (
        <button 
          className="track-delete-button" 
          onClick={handleDelete}
          aria-label="트랙 삭제"
        >
          🗑️
        </button>
      )}

      {/* 재생 아이콘 */}
      <span className="track-play-icon">▶️</span>
    </div>
  );
};

