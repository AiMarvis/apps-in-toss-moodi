import React from 'react';
import type { EmotionInfo } from '../../types/emotion';
import './EmotionChip.css';

interface EmotionChipProps {
  emotion: EmotionInfo;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * 감정 선택 칩 컴포넌트 (PRD 5.1.1, component_guide.md 5.1)
 * - 이모지 + 한글 레이블
 * - 선택 상태 시각적 피드백
 * - 터치 친화적 크기 (44px 이상)
 */
export const EmotionChip: React.FC<EmotionChipProps> = ({
  emotion,
  selected = false,
  onClick,
  disabled = false,
}) => {
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
      <span className="emoji">{emotion.emoji}</span>
      <span className="label">{emotion.label}</span>
    </button>
  );
};

