import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TabBar.css';

interface TabItem {
  path: string;
  label: string;
  icon: string;
  iconActive: string;
  icon3D: string;
}

const TABS: TabItem[] = [
  { path: '/', label: '홈', icon: '🏠', iconActive: '🏠', icon3D: '/assets/icons/home-3d.svg' },
  { path: '/calendar', label: '캘린더', icon: '📅', iconActive: '📅', icon3D: '/assets/icons/calendar-3d.svg' },
  { path: '/library', label: '내 음악', icon: '🎵', iconActive: '🎵', icon3D: '/assets/icons/music-3d.svg' },
  { path: '/settings', label: '설정', icon: '⚙️', iconActive: '⚙️', icon3D: '/assets/icons/settings-3d.svg' },
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
            <img src={tab.icon3D} alt="" className="tab-icon" />
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};




















