import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarView } from '../components/calendar/CalendarView';
import { useDiary } from '../hooks/useDiary';
import { EMOTIONS } from '../constants/emotions';
import type { DiaryEntry } from '../types/diary';
import './CalendarPage.css';

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { diaries, fetchDiariesByMonth } = useDiary();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDiaries, setSelectedDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    fetchDiariesByMonth(year, month);
  }, [currentDate, fetchDiariesByMonth]);

  const diaryDates = useMemo(() => {
    const map = new Map<string, string>();
    diaries.forEach(diary => {
      map.set(diary.date, diary.emotion);
    });
    return map;
  }, [diaries]);

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
    setSelectedDate(null);
    setSelectedDiaries([]);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateString = format(date, 'yyyy-MM-dd');
    const filtered = diaries.filter(d => d.date === dateString);
    setSelectedDiaries(filtered);
  };

  const handleDiaryClick = (diary: DiaryEntry) => {
    if (diary.trackId) {
      navigate('/player', { state: { trackId: diary.trackId, diary } });
    }
  };

  const handleNewDiary = () => {
    const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    navigate('/', { state: { diaryDate: dateString } });
  };

  const getEmotionInfo = (emotionId: string) => {
    return EMOTIONS.find(e => e.id === emotionId);
  };

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <h1 className="calendar-title">감정 캘린더</h1>
        <p className="calendar-subtitle">나의 감정 흐름을 확인해보세요</p>
      </header>

      <main className="calendar-content">
        <CalendarView
          currentDate={currentDate}
          onMonthChange={handleMonthChange}
          onDateSelect={handleDateSelect}
          diaryDates={diaryDates}
          selectedDate={selectedDate}
        />

        {selectedDate && (
          <section className="diary-section">
            <div className="diary-section-header">
              <h2 className="diary-section-title">
                {format(selectedDate, 'M월 d일 EEEE', { locale: ko })}
              </h2>
              <button className="add-diary-btn" onClick={handleNewDiary}>
                + 일기 쓰기
              </button>
            </div>

            {selectedDiaries.length === 0 ? (
              <div className="empty-diary">
                <span className="empty-icon">📝</span>
                <p>이 날의 기록이 없어요</p>
                <button className="create-diary-btn" onClick={handleNewDiary}>
                  오늘의 감정 기록하기
                </button>
              </div>
            ) : (
              <div className="diary-list">
                {selectedDiaries.map(diary => {
                  const emotionInfo = getEmotionInfo(diary.emotion);
                  return (
                    <div 
                      key={diary.id} 
                      className="diary-card"
                      onClick={() => handleDiaryClick(diary)}
                    >
                      <div className="diary-emotion">
                        <span className="emotion-emoji">{emotionInfo?.emoji}</span>
                        <span className="emotion-label">{emotionInfo?.label}</span>
                      </div>
                      <p className="diary-content">{diary.content}</p>
                      {diary.trackId && (
                        <div className="diary-music-indicator">
                          🎵 음악이 연결되어 있어요
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {!selectedDate && (
          <div className="calendar-hint">
            <span className="hint-icon">👆</span>
            <p>날짜를 선택해서 그날의 감정을 확인해보세요</p>
          </div>
        )}
      </main>
    </div>
  );
};
