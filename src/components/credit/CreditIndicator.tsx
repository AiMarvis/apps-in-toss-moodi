import React from 'react';
import { useCredits } from '../../hooks/useCredits';
import { DAILY_CREDITS } from '../../constants/emotions';
import './CreditIndicator.css';

interface CreditIndicatorProps {
  showLabel?: boolean;
  size?: 'small' | 'medium';
}

/**
 * 크레딧 표시 컴포넌트 (PRD 5.0)
 * - 남은 크레딧 수 표시
 * - 시각적 상태 (충분/부족)
 */
export const CreditIndicator: React.FC<CreditIndicatorProps> = ({
  showLabel = true,
  size = 'medium',
}) => {
  const { credits, loading } = useCredits();

  const isLow = credits <= 1;
  const isEmpty = credits <= 0;

  return (
    <div className={`credit-indicator ${size} ${isEmpty ? 'empty' : isLow ? 'low' : ''}`}>
      <span className="credit-icon">✨</span>
      {loading ? (
        <span className="credit-count">-</span>
      ) : (
        <>
          <span className="credit-count">{credits}</span>
          {showLabel && (
            <span className="credit-label">/ {DAILY_CREDITS}</span>
          )}
        </>
      )}
    </div>
  );
};




















