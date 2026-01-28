import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';
import { TabBar } from './components/common/TabBar';
import { useAuthStore } from './stores/authStore';

import { SplashPage } from './pages/SplashPage';
import { IntroductionPage } from './pages/IntroductionPage';
import { HomePage } from './pages/HomePage';
import { LoadingPage } from './pages/LoadingPage';
import { PlayerPage } from './pages/PlayerPage';
import { LibraryPage } from './pages/LibraryPage';
import { CalendarPage } from './pages/CalendarPage';
import { DiaryWritePage } from './pages/DiaryWritePage';
import { CreditStorePage } from './pages/CreditStorePage';
import { SettingsPage } from './pages/SettingsPage';

import './styles/global.css';

const ROUTES_WITHOUT_TABBAR = ['/splash', '/intro', '/loading', '/player', '/diary/write'];
const SESSION_KEY_SPLASH_SHOWN = 'moodi_splash_shown';

// 앱 시작 시 Splash를 거치도록 하는 가드 컴포넌트
function SplashGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isOnSplashOrIntro = location.pathname === '/splash' || location.pathname === '/intro';

  useEffect(() => {
    if (location.pathname === '/splash') {
      sessionStorage.setItem(SESSION_KEY_SPLASH_SHOWN, 'true');
    }
  }, [location.pathname]);

  useEffect(() => {
    const splashShown = sessionStorage.getItem(SESSION_KEY_SPLASH_SHOWN);
    if (!splashShown && !isOnSplashOrIntro) {
      navigate('/splash', { replace: true });
    }
  }, [isOnSplashOrIntro, navigate]);

  const splashShown = sessionStorage.getItem(SESSION_KEY_SPLASH_SHOWN);
  if (!splashShown && !isOnSplashOrIntro) {
    return null;
  }

  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const showTabBar = !ROUTES_WITHOUT_TABBAR.includes(location.pathname);

  return (
    <SplashGuard>
      <Routes>
        <Route path="/splash" element={<SplashPage />} />
        <Route path="/intro" element={<IntroductionPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/diary/write" element={<DiaryWritePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/store" element={<CreditStorePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
      {showTabBar && <TabBar />}
    </SplashGuard>
  );
}

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  return (
    <TDSMobileAITProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TDSMobileAITProvider>
  );
}

export default App;
