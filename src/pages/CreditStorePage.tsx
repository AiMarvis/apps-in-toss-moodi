import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditIndicator } from '../components/credit/CreditIndicator';
import { useCredits } from '../hooks/useCredits';
import { useIap } from '../hooks/useIap';
import { INITIAL_CREDITS, CREDIT_PRODUCTS, type CreditProduct } from '../constants/emotions';
import './CreditStorePage.css';

// 크레딧 패키지 (UI 표시용)
const CREDIT_PACKAGES = [
  { id: 'basic', amount: 10, price: '₩3,300', popular: false },
  { id: 'value', amount: 33, price: '₩9,900', popular: true },
];

/**
 * 크레딧 스토어 페이지
 * - 크레딧 현황 표시
 * - 크레딧 패키지 목록
 * - 실제 IAP 결제 연동
 */
export const CreditStorePage: React.FC = () => {
  const navigate = useNavigate();
  const { refetch } = useCredits();
  const { purchase, loading: iapLoading, error: iapError } = useIap();

  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [lastFailedProduct, setLastFailedProduct] = useState<CreditProduct | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // 패키지에 해당하는 상품 찾기
  const findProduct = (pkg: typeof CREDIT_PACKAGES[0]): CreditProduct | undefined => {
    return CREDIT_PRODUCTS.find(p => p.amount === pkg.amount);
  };

  const handleBuy = async (pkg: typeof CREDIT_PACKAGES[0]) => {
    setPurchaseError(null);
    setLastFailedProduct(null);
    setIsPurchasing(true);

    const product = findProduct(pkg);
    if (!product) {
      setPurchaseError('상품 정보를 찾을 수 없어요.');
      setIsPurchasing(false);
      return;
    }

    try {
      const success = await purchase(product);

      if (success) {
        // 성공 - 크레딧 새로고침
        await refetch();
      } else {
        // 실패 - 재시도 UI 표시
        setPurchaseError('결제에 실패했어요. 다시 시도해 주세요.');
        setLastFailedProduct(product);
      }
    } catch {
      setPurchaseError('결제 중 오류가 발생했어요.');
      setLastFailedProduct(product);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRetry = async () => {
    if (!lastFailedProduct) return;

    setPurchaseError(null);
    setIsPurchasing(true);

    try {
      const success = await purchase(lastFailedProduct);

      if (success) {
        await refetch();
        setLastFailedProduct(null);
      } else {
        setPurchaseError('결제에 실패했어요. 다시 시도해 주세요.');
      }
    } catch {
      setPurchaseError('결제 중 오류가 발생했어요.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleDismissError = () => {
    setPurchaseError(null);
    setLastFailedProduct(null);
  };

  const isLoading = iapLoading || isPurchasing;
  const displayError = purchaseError || iapError;

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

        {/* Error Message */}
        {displayError && (
          <section className="error-section">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <p className="error-message">{displayError}</p>
            </div>
            <div className="error-actions">
              {lastFailedProduct && (
                <button
                  className="retry-button"
                  onClick={handleRetry}
                  disabled={isLoading}
                >
                  {isLoading ? '처리 중...' : '다시 시도'}
                </button>
              )}
              <button
                className="dismiss-button"
                onClick={handleDismissError}
              >
                닫기
              </button>
            </div>
          </section>
        )}

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
                  disabled={isLoading}
                >
                  {isLoading ? '처리 중...' : '구매하기'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Notice */}
        <section className="notice-section">
          <h3 className="notice-title">알아두세요</h3>
          <ul className="notice-list">
            <li>크레딧 1개로 음악 1곡을 만들 수 있어요</li>
            <li>구매한 크레딧은 유효기간이 없어요</li>
            <li>환불은 구매 후 7일 이내에 가능해요</li>
          </ul>
        </section>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <p className="loading-text">결제를 진행하고 있어요...</p>
        </div>
      )}
    </div>
  );
};
