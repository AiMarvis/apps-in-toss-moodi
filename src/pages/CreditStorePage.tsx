import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditIndicator } from '../components/credit/CreditIndicator';
import { useCredits } from '../hooks/useCredits';
import { INITIAL_CREDITS } from '../constants/emotions';
import './CreditStorePage.css';

// 크레딧 패키지
const CREDIT_PACKAGES = [
  { id: 'basic', amount: 10, price: '₩3,300', popular: false },
  { id: 'value', amount: 33, price: '₩9,900', popular: true },
];

/**
 * 크레딧 스토어 페이지 (PRD 9.0 - MVP에서는 Mock)
 * - 크레딧 현황 표시
 * - 크레딧 패키지 목록
 * - Mock 구매 (실제 결제 연동 X)
 */
export const CreditStorePage: React.FC = () => {
  const navigate = useNavigate();
  const { refetch } = useCredits();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof CREDIT_PACKAGES[0] | null>(null);

  const handleBuy = (pkg: typeof CREDIT_PACKAGES[0]) => {
    setSelectedPackage(pkg);
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = () => {
    // MVP: Mock 구매 성공
    // 실제로는 결제 연동이 필요하지만, MVP에서는 알림만 표시
    setShowPurchaseModal(false);
    setSelectedPackage(null);
    
    // 크레딧은 서버에서 관리하므로 실제 변경 없음
    alert('🎉 테스트 모드: 실제 결제는 연동되지 않았어요.');
    refetch();
  };

  return (
    <div className="store-page">
      {/* Header */}
      <header className="store-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="store-title">크레딧 충전</h1>
        <div className="header-spacer" />
      </header>

      {/* Content */}
      <main className="store-content">
        {/* Current Credits */}
        <section className="current-credits">
          <p className="credits-label">현재 보유 크레딧</p>
          <CreditIndicator showLabel={false} size="medium" />
          <p className="credits-info">
            첫 가입 시 {INITIAL_CREDITS}크레딧이 무료로 증정돼요
          </p>
        </section>

        {/* Packages */}
        <section className="packages-section">
          <h2 className="section-title">크레딧 패키지</h2>
          <div className="packages-list">
            {CREDIT_PACKAGES.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`package-card ${pkg.popular ? 'popular' : ''}`}
              >
                {pkg.popular && <span className="popular-badge">인기</span>}
                <div className="package-amount">
                  <span className="amount-value">{pkg.amount}</span>
                  <span className="amount-unit">크레딧</span>
                </div>
                <div className="package-price">{pkg.price}</div>
                <button 
                  className="buy-button"
                  onClick={() => handleBuy(pkg)}
                >
                  구매하기
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Notice */}
        <section className="notice-section">
          <h3 className="notice-title">💡 알아두세요</h3>
          <ul className="notice-list">
            <li>크레딧 1개로 음악 1곡을 만들 수 있어요</li>
            <li>구매한 크레딧은 유효기간이 없어요</li>
            <li>환불은 구매 후 7일 이내에 가능해요</li>
          </ul>
        </section>
      </main>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedPackage && (
        <div className="modal-overlay" onClick={() => setShowPurchaseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">크레딧을 구매할까요?</h3>
            <div className="modal-package">
              <span className="modal-amount">{selectedPackage.amount} 크레딧</span>
              <span className="modal-price">{selectedPackage.price}</span>
            </div>
            <p className="modal-notice">
              🚧 MVP 테스트 모드입니다.<br />
              실제 결제는 연동되지 않았어요.
            </p>
            <div className="modal-actions">
              <button 
                className="modal-cancel" 
                onClick={() => setShowPurchaseModal(false)}
              >
                취소
              </button>
              <button 
                className="modal-confirm" 
                onClick={handleConfirmPurchase}
              >
                구매하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

