import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCredits } from '../hooks/useCredits';
import './SettingsPage.css';

/**
 * 설정 페이지
 * - 사용자 정보 (토스 로그인/로그아웃)
 * - 크레딧 현황
 * - 앱 정보
 */
export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, logout, loading } = useAuth();
  const { credits } = useCredits();

  const handleGoToStore = () => {
    navigate('/store');
  };

  const handleLogin = async () => {
    await login();
  };

  const handleLogout = async () => {
    await logout();
  };

  // 토스 로그인 여부 확인 (uid가 'toss_'로 시작하면 토스 로그인)
  const isTossUser = user?.uid.startsWith('toss_');

  return (
    <div className="settings-page">
      {/* Header */}
      <header className="settings-header">
        <h1 className="settings-title">설정</h1>
      </header>

      {/* Content */}
      <main className="settings-content">
        {/* Profile Section */}
        <section className="settings-section">
          <h2 className="section-title">내 정보</h2>
          <div className="settings-card">
            {!user ? (
              <div className="login-section">
                <p className="login-description">토스 계정으로 로그인하면 모든 기기에서 음악을 동기화할 수 있어요</p>
                <button 
                  className="login-button"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? '로그인 중...' : '토스로 로그인'}
                </button>
              </div>
            ) : (
              <div className="profile-item">
                <div className="profile-avatar">
                  <span className="avatar-icon">{isTossUser ? '🔵' : '👤'}</span>
                </div>
                <div className="profile-info">
                  <div className="profile-name-row">
                    <p className="profile-name">
                      {isTossUser ? '토스 사용자' : '사용자'}
                    </p>
                    {/* 로그인 상태 배지 */}
                    <span className={`login-status-badge ${isTossUser ? 'toss' : ''}`}>
                      ✓ {isTossUser ? '토스 연결됨' : '로그인됨'}
                    </span>
                  </div>
                  <p className="profile-id">ID: {user.uid.substring(0, 12)}...</p>
                  <button className="logout-button" onClick={handleLogout}>
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Credits Section */}
        <section className="settings-section">
          <h2 className="section-title">크레딧</h2>
          <div className="settings-card">
            <div className="menu-item" onClick={handleGoToStore}>
              <div className="menu-icon">✨</div>
              <div className="menu-content">
                <span className="menu-label">남은 크레딧</span>
                <span className="menu-value">{credits}개</span>
              </div>
              <span className="menu-arrow">→</span>
            </div>
            <div className="menu-divider" />
            <a
              className="menu-item"
              href="mailto:support@moodi.example.com?subject=환불 요청"
            >
              <div className="menu-icon">💳</div>
              <div className="menu-content">
                <span className="menu-label">환불 요청</span>
                <span className="menu-hint">구매 후 7일 이내</span>
              </div>
              <span className="menu-arrow">→</span>
            </a>
          </div>
          <p className="section-notice">
            구매 후 7일 이내, 미사용 크레딧에 한해 환불 가능해요
          </p>
        </section>

        {/* App Info Section */}
        <section className="settings-section">
          <h2 className="section-title">앱 정보</h2>
          <div className="settings-card">
            <div className="menu-item">
              <div className="menu-icon">ℹ️</div>
              <div className="menu-content">
                <span className="menu-label">버전</span>
                <span className="menu-value">1.0.0 (MVP)</span>
              </div>
            </div>
            <div className="menu-divider" />
            <a 
              className="menu-item" 
              href="https://moodi.example.com/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <div className="menu-icon">🔒</div>
              <div className="menu-content">
                <span className="menu-label">개인정보 처리방침</span>
              </div>
              <span className="menu-arrow">→</span>
            </a>
            <div className="menu-divider" />
            <a 
              className="menu-item" 
              href="https://moodi.example.com/terms" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <div className="menu-icon">📄</div>
              <div className="menu-content">
                <span className="menu-label">서비스 이용약관</span>
              </div>
              <span className="menu-arrow">→</span>
            </a>
          </div>
        </section>

        {/* Support Section */}
        <section className="settings-section">
          <h2 className="section-title">지원</h2>
          <div className="settings-card">
            <a 
              className="menu-item" 
              href="mailto:support@moodi.example.com"
            >
              <div className="menu-icon">📧</div>
              <div className="menu-content">
                <span className="menu-label">문의하기</span>
              </div>
              <span className="menu-arrow">→</span>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="settings-footer">
          <p className="footer-text">Made with 💜 by Moodi Team</p>
          <p className="footer-copyright">© 2025 Moodi. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};
