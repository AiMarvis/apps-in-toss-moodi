import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EmotionChip } from '../components/common/EmotionChip';
import { EmotionCategoryTabs } from '../components/common/EmotionCategoryTabs';
import { EMOTIONS } from '../constants/emotions';
import { useDiary } from '../hooks/useDiary';
import type { EmotionKeyword, EmotionCategory } from '../types/emotion';
import './DiaryWritePage.css';

interface LocationState {
  date?: string;
}

const MAX_CONTENT_LENGTH = 500;

export const DiaryWritePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const { addDiary } = useDiary();

  const today = new Date().toISOString().split('T')[0];
  const diaryDate = state?.date || today;

  const [selectedEmotion, setSelectedEmotion] = useState<EmotionKeyword | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EmotionCategory>('negative');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredEmotions = useMemo(() => {
    return EMOTIONS.filter((e) => e.category === selectedCategory);
  }, [selectedCategory]);

  const canSave = selectedEmotion !== null && content.trim().length > 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const handleSave = async () => {
    if (!canSave || isSaving) return;

    setIsSaving(true);
    try {
      await addDiary({
        date: diaryDate,
        emotion: selectedEmotion,
        content: content.trim(),
      });
      navigate('/calendar', { replace: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="diary-write-page">
      <header className="diary-write-header">
        <button className="back-button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          ←
        </button>
        <h1 className="diary-write-title">일기 쓰기</h1>
        <div className="header-spacer" />
      </header>

      <main className="diary-write-content">
        <section className="date-section">
          <span className="date-label">{formatDate(diaryDate)}</span>
        </section>

        <section className="emotion-section diary-card">
          <h3 className="section-label">오늘의 감정</h3>
          <EmotionCategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <div className="emotion-grid">
            {filteredEmotions.map((emotion) => (
              <div className="emotion-chip-wrapper" key={emotion.id}>
                <EmotionChip
                  emotion={emotion}
                  selected={selectedEmotion === emotion.id}
                  onClick={() => setSelectedEmotion(emotion.id)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="content-section diary-card">
          <label className="section-label" htmlFor="diary-content">
            오늘 하루는 어땠나요?
          </label>
          <div className="content-input-container">
            <textarea
              id="diary-content"
              className="diary-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
              placeholder="오늘의 기분이나 있었던 일을 자유롭게 적어주세요"
              rows={6}
            />
            <span className="char-count">
              {content.length} / {MAX_CONTENT_LENGTH}
            </span>
          </div>
        </section>
      </main>

      <footer className="diary-write-footer">
        <button
          className={`save-button ${canSave && !isSaving ? '' : 'disabled'}`}
          onClick={handleSave}
          disabled={!canSave || isSaving}
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
      </footer>
    </div>
  );
};
