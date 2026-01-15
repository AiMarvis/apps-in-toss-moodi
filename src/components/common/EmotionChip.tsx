import React from 'react';
import type { EmotionInfo } from '../../types/emotion';
import './EmotionChip.css';

interface EmotionChipProps {
  emotion: EmotionInfo;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

// 3D 아이콘 매핑
const EMOTION_3D_ICONS: Record<string, string> = {
  sad: '/assets/emotions/sad-3d.svg',
  anxious: '/assets/emotions/anxious-3d.svg',
  angry: '/assets/emotions/angry-3d.svg',
  depressed: '/assets/emotions/depressed-3d.svg',
  tired: '/assets/emotions/tired-3d.svg',
  calm: '/assets/emotions/calm-3d.svg',
};

/**
 * 감정 선택 칩 컴포넌트 (PRD 5.1.1, component_guide.md 5.1)
 * - 3D 아이콘 + 한글 레이블
 * - 글래스모피즘 디자인
 * - 선택 상태 시각적 피드백
 * - 터치 친화적 크기
 */
export const EmotionChip: React.FC<EmotionChipProps> = ({
  emotion,
  selected = false,
  onClick,
  disabled = false,
}) => {
  const iconSrc = EMOTION_3D_ICONS[emotion.id] || emotion.emoji;
  const isIconUrl = typeof iconSrc === 'string' && iconSrc.startsWith('/');

  return (
    <button
      className={`emotion-chip ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`${emotion.label} 감정 선택`}
      style={{
        '--emotion-color': emotion.color,
      } as React.CSSProperties}
    >
      {isIconUrl ? (
        <img src={iconSrc} alt="" className="emoji" />
      ) : (
        <span className="emoji">{emotion.emoji}</span>
      )}
      <span className="label">{emotion.label}</span>
    </button>
  );
};

