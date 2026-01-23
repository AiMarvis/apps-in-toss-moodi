import React from 'react';
import './LoadingAnimation.css';

interface LoadingAnimationProps {
  progress?: number;
  message?: string;
  submessage?: string;
}

// 로딩 메시지 목록 (PRD 4.1.5, UX 대기 시간 처리)
const LOADING_MESSAGES = [
  { message: '당신의 감정을 음악으로 바꾸고 있어요', submessage: '조금만 기다려 주세요...' },
  { message: '멜로디를 만들고 있어요', submessage: '음표들이 모이고 있어요' },
  { message: '화음을 더하고 있어요', submessage: '거의 다 됐어요!' },
  { message: '마지막 손질을 하고 있어요', submessage: '곧 완성이에요' },
];

/**
 * 음악 생성 로딩 애니메이션 컴포넌트 (component_guide.md 5.2)
 * - 진행률 표시
 * - 단계별 메시지
 * - 부드러운 애니메이션
 */
export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  progress = 0,
  message,
  submessage,
}) => {
  // 진행률에 따른 메시지 선택
  const getMessageIndex = () => {
    if (progress < 25) return 0;
    if (progress < 50) return 1;
    if (progress < 75) return 2;
    return 3;
  };

  const currentMessage = LOADING_MESSAGES[getMessageIndex()];
  const displayMessage = message || currentMessage.message;
  const displaySubmessage = submessage || currentMessage.submessage;

  return (
    <div className="loading-container">
      {/* 애니메이션 링 */}
      <div className="loading-ring-container">
        <div className="loading-ring">
          <svg viewBox="0 0 100 100" className="loading-svg">
            {/* 배경 원 */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--color-border-light)"
              strokeWidth="6"
            />
            {/* 진행 원 */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="progress-circle"
            />
          </svg>
          
          {/* 중앙 아이콘 */}
          <div className="loading-icon">
            <span className="music-note">🎵</span>
          </div>
        </div>
        
        {/* 물결 애니메이션 */}
        <div className="pulse-ring pulse-ring-1"></div>
        <div className="pulse-ring pulse-ring-2"></div>
      </div>

      {/* 진행률 텍스트 */}
      <div className="loading-progress">{Math.round(progress)}%</div>

      {/* 메시지 */}
      <div className="loading-message-container">
        <p className="loading-message">{displayMessage}</p>
        <p className="loading-submessage">{displaySubmessage}</p>
      </div>
    </div>
  );
};




















