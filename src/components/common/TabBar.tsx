import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TabBar.css';

interface TabItem {
  path: string;
  label: string;
  icon: string;
  iconActive: string;
}

const TABS: TabItem[] = [
  { path: '/', label: '홈', icon: '🏠', iconActive: '🏠' },
  { path: '/calendar', label: '캘린더', icon: '📅', iconActive: '📅' },
  { path: '/library', label: '내 음악', icon: '🎵', iconActive: '🎵' },
  { path: '/settings', label: '설정', icon: '⚙️', iconActive: '⚙️' },
];

/**
 * 하단 탭 바 컴포넌트
 * - 홈, 내 음악, 설정
 */
export const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 특정 페이지에서는 탭바 숨김
  const hiddenPaths = ['/loading', '/player', '/store'];
  if (hiddenPaths.some(path => location.pathname.startsWith(path))) {
    return null;
  }

  return (
    <nav className="tab-bar">
      {TABS.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="tab-icon">{isActive ? tab.iconActive : tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};




















