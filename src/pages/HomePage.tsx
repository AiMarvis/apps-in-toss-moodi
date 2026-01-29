import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@toss/tds-mobile';
import { closeView, graniteEvent } from '@apps-in-toss/web-framework';
import { EmotionChip } from '../components/common/EmotionChip';
import { EmotionCategoryTabs } from '../components/common/EmotionCategoryTabs';
import { CreditIndicator } from '../components/credit/CreditIndicator';
import { EMOTIONS } from '../constants/emotions';
import type { EmotionKeyword, EmotionCategory } from '../types/emotion';
import { useCredits } from '../hooks/useCredits';
import './HomePage.css';

const MAX_TEXT_LENGTH = 100;

const MUSIC_TYPES = [
  { id: 'calm', label: '잔잔한', emoji: '🌊' },
  { id: 'upbeat', label: '신나는', emoji: '🎉' },
  { id: 'dramatic', label: '드라마틱', emoji: '🎭' },
  { id: 'jazz', label: '재즈', emoji: '🎷' },
  { id: 'classical', label: '클래식', emoji: '🎻' },
  { id: 'lofi', label: 'Lo-fi', emoji: '🎧' },
];

/**
 * 홈 페이지 - 감정 입력 UI (PRD 5.1)
 * - 감정 키워드 칩 선택
 * - 추가 텍스트 입력 (선택)
 * - 음악 생성 시작 버튼
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { credits } = useCredits();
  
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionKeyword | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EmotionCategory>('negative');
  const [selectedMusicType, setSelectedMusicType] = useState<string | null>(null);
  const [emotionText, setEmotionText] = useState('');
  const [hasLyrics, setHasLyrics] = useState(true);
  const [lyricsLanguage, setLyricsLanguage] = useState<'ko' | 'en'>('ko');

  // 홈 화면에서 백버튼 시 앱 종료
  useEffect(() => {
    const unsubscription = graniteEvent.addEventListener('backEvent', {
      onEvent: async () => {
        await closeView();
      },
      onError: (error) => console.error('[HomePage] backEvent error:', error),
    });

    return () => unsubscription();
  }, []);

  const filteredEmotions = useMemo(() => {
    return EMOTIONS.filter((e) => e.category === selectedCategory);
  }, [selectedCategory]);

  const canGenerate = selectedEmotion !== null && credits > 0;

  const handleGenerate = () => {
    if (!canGenerate) return;
    
    // 로딩 페이지로 이동하며 감정 정보 전달
    navigate('/loading', {
      state: {
        emotion: selectedEmotion,
        musicType: selectedMusicType,
        emotionText: emotionText.trim() || undefined,
        instrumental: !hasLyrics,
        lyricsLanguage: hasLyrics ? lyricsLanguage : undefined,
      },
    });
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <h1 className="home-title">무디</h1>
        <CreditIndicator />
      </header>

      {/* Main Content */}
      <main className="home-content">
        {/* Greeting */}
        <section className="greeting-section">
          <h2 className="greeting-title">오늘 기분이 어때요?</h2>
          <p className="greeting-subtitle">
            감정을 선택하면 당신만을 위한<br />
            음악을 만들어 드릴게요
          </p>
        </section>

        {/* Emotion Selection */}
        <section className="emotion-section home-card">
          <h3 className="section-label">지금 느끼는 감정을 선택해주세요</h3>
          <EmotionCategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            disabled={credits <= 0}
          />
          <div className="emotion-grid">
            {filteredEmotions.map((emotion) => (
              <div className="emotion-chip-wrapper" key={emotion.id}>
                <EmotionChip
                  emotion={emotion}
                  selected={selectedEmotion === emotion.id}
                  onClick={() => setSelectedEmotion(emotion.id)}
                  disabled={credits <= 0}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Music Type Selection (Optional) */}
        <section className="music-type-section home-card">
          <h3 className="section-label">
            어떤 스타일의 음악을 원하시나요? <span className="optional">(선택)</span>
          </h3>
          <div className="music-type-scroll">
            {MUSIC_TYPES.map((type) => (
              <button
                key={type.id}
                className={`music-type-chip ${selectedMusicType === type.id ? 'selected' : ''} ${credits <= 0 ? 'disabled' : ''}`}
                onClick={() => setSelectedMusicType(selectedMusicType === type.id ? null : type.id)}
                disabled={credits <= 0}
              >
                <span>{type.emoji}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Lyrics Selection */}
        <section className="lyrics-section home-card">
          <h3 className="section-label">
            가사가 포함된 음악을 원하시나요?
          </h3>
          <div className="lyrics-options">
            <button
              className={`lyrics-option ${hasLyrics ? 'selected' : ''} ${credits <= 0 ? 'disabled' : ''}`}
              onClick={() => setHasLyrics(true)}
              disabled={credits <= 0}
            >
              <span className="lyrics-emoji">🎤</span>
              <span className="lyrics-label">가사 포함</span>
            </button>
            <button
              className={`lyrics-option ${!hasLyrics ? 'selected' : ''} ${credits <= 0 ? 'disabled' : ''}`}
              onClick={() => setHasLyrics(false)}
              disabled={credits <= 0}
            >
              <span className="lyrics-emoji">🎵</span>
              <span className="lyrics-label">연주곡</span>
            </button>
          </div>
        </section>

        {/* Lyrics Language Selection (가사 포함 시에만 표시) */}
        {hasLyrics && (
          <section className="lyrics-language-section home-card">
            <h3 className="section-label">
              가사 언어를 선택해주세요
            </h3>
            <div className="lyrics-language-options">
              <button
                className={`language-option ${lyricsLanguage === 'ko' ? 'selected' : ''} ${credits <= 0 ? 'disabled' : ''}`}
                onClick={() => setLyricsLanguage('ko')}
                disabled={credits <= 0}
              >
                한국어
              </button>
              <button
                className={`language-option ${lyricsLanguage === 'en' ? 'selected' : ''} ${credits <= 0 ? 'disabled' : ''}`}
                onClick={() => setLyricsLanguage('en')}
                disabled={credits <= 0}
              >
                English
              </button>
            </div>
          </section>
        )}

        {/* Text Input (Optional) */}
        <section className="text-section home-card">
          <label className="section-label" htmlFor="emotion-text">
            더 이야기하고 싶은 게 있다면 <span className="optional">(선택)</span>
          </label>
          <div className="text-input-container">
            <textarea
              id="emotion-text"
              className="emotion-textarea"
              value={emotionText}
              onChange={(e) => setEmotionText(e.target.value.slice(0, MAX_TEXT_LENGTH))}
              placeholder="예: 비 오는 날 창 밖을 보며 생각이 많아졌어요"
              rows={3}
              disabled={credits <= 0}
            />
            <span className="char-count">
              {emotionText.length} / {MAX_TEXT_LENGTH}
            </span>
          </div>
        </section>

        {/* Credit Warning */}
        {credits <= 0 && (
          <div className="credit-warning-container">
            <div className="credit-warning">
              <span className="warning-icon">⚠️</span>
              <span>오늘의 크레딧을 모두 사용했어요.<br/>내일 다시 만나요!</span>
            </div>
          </div>
        )}
      </main>

      {/* Generate Button */}
      <footer className="home-footer">
        <Button
          color="primary"
          display="block"
          size="xlarge"
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          🎵 나만의 음악 만들기
        </Button>
      </footer>
    </div>
  );
};

