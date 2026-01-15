import React from 'react';
import { useNavigate } from 'react-router-dom';
import MoodiCharacter from '../assets/moodi-character.svg';
import './IntroductionPage.css';

const STORAGE_KEY_SEEN_INTRO = 'moodi_seen_intro';

export const IntroductionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    localStorage.setItem(STORAGE_KEY_SEEN_INTRO, 'true');
    navigate('/', { replace: true });
  };

  return (
    <div className="intro-page">
      <div className="intro-background-character">
        <img 
          src={MoodiCharacter} 
          alt="" 
          aria-hidden="true"
          className="background-character-image"
        />
      </div>

      <div className="intro-decoration">
        <span className="decoration-note">♪</span>
      </div>

      <div className="intro-character">
        <img 
          src={MoodiCharacter} 
          alt="Moodi 캐릭터" 
          className="intro-character-image"
        />
      </div>

      <div className="intro-content">
        <span className="intro-hello">hello</span>
        
        <h1 className="intro-title">
          안녕, 나는 <span className="highlight">무디</span>야
        </h1>
        
        <p className="intro-description">
          네가 느끼는 감정을 이야기해 주면,<br />
          그 순간에 어울리는 음악을 만들어 줄게.<br />
          <br />
          힘든 하루를 보냈다면,<br />
          나와 함께 음악으로 위로받아 볼래?
        </p>
      </div>

      <div className="intro-cta">
        <button 
          className="intro-button"
          onClick={handleStart}
        >
          무디 만나기
        </button>
        
        <div className="intro-security">
          <span className="security-icon">🔒</span>
          <span className="security-text">
            당신의 감정 기록은 안전하게 보호돼요
          </span>
        </div>
      </div>
    </div>
  );
};
