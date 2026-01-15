import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodiCharacter from '../assets/moodi-character.svg';
import './SplashPage.css';

const SPLASH_DURATION_MS = 2500;
const STORAGE_KEY_SEEN_INTRO = 'moodi_seen_intro';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem(STORAGE_KEY_SEEN_INTRO);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      const nextRoute = hasSeenIntro ? '/' : '/intro';
      navigate(nextRoute, { replace: true });
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-page">
      <div className="splash-background">
        <div className="splash-glow splash-glow-1" />
        <div className="splash-glow splash-glow-2" />
      </div>

      <div className="splash-character-container">
        <div className="splash-particles">
          <span className="particle particle-1" />
          <span className="particle particle-2" />
          <span className="particle particle-3" />
          <span className="particle particle-4" />
          <span className="particle particle-5" />
          <span className="particle particle-6" />
        </div>

        <div className="splash-character">
          <img 
            src={MoodiCharacter} 
            alt="Moodi 캐릭터" 
            className="character-image"
          />
        </div>

        <div className="splash-floor-glow" />
      </div>

      <div className="splash-branding">
        <h1 className="splash-logo">moodi</h1>
        <p className="splash-tagline">당신의 감정을 음악으로</p>
      </div>

      {isLoading && (
        <div className="splash-loading-dots">
          <span className="dot dot-1" />
          <span className="dot dot-2" />
          <span className="dot dot-3" />
        </div>
      )}
    </div>
  );
};
