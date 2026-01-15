import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TabBar } from './components/common/TabBar';

import { SplashPage } from './pages/SplashPage';
import { IntroductionPage } from './pages/IntroductionPage';
import { HomePage } from './pages/HomePage';
import { LoadingPage } from './pages/LoadingPage';
import { PlayerPage } from './pages/PlayerPage';
import { LibraryPage } from './pages/LibraryPage';
import { CalendarPage } from './pages/CalendarPage';
import { CreditStorePage } from './pages/CreditStorePage';
import { SettingsPage } from './pages/SettingsPage';

import './styles/global.css';

const ROUTES_WITHOUT_TABBAR = ['/splash', '/intro', '/loading', '/player'];

function AppContent() {
  const location = useLocation();
  const showTabBar = !ROUTES_WITHOUT_TABBAR.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/splash" element={<SplashPage />} />
        <Route path="/intro" element={<IntroductionPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/store" element={<CreditStorePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
      {showTabBar && <TabBar />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
