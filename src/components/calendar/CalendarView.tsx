import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import './CalendarView.css';

interface CalendarViewProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  onDateSelect: (date: Date) => void;
  diaryDates: Map<string, string>;
  selectedDate: Date | null;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const getEmotionColor = (emotion: string): string => {
  const map: Record<string, string> = {
    sad: 'var(--color-emotion-sad)',
    anxious: 'var(--color-emotion-anxious)',
    angry: 'var(--color-emotion-angry)',
    depressed: 'var(--color-emotion-depressed)',
    tired: 'var(--color-emotion-tired)',
    calm: 'var(--color-emotion-calm)',
  };
  return map[emotion.toLowerCase()] || 'var(--color-text-hint)';
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  onMonthChange,
  onDateSelect,
  diaryDates,
  selectedDate,
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const handlePrevMonth = () => {
    onMonthChange(addMonths(currentDate, -1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentDate, 1));
  };

  const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button 
          className="nav-button" 
          onClick={handlePrevMonth}
          aria-label="Previous month"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <h2 className="month-title">
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
        </h2>

        <button 
          className="nav-button" 
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div className="weekdays-grid">
        {WEEKDAYS.map((day) => (
          <div key={day} className="weekday-label">
            {day}
          </div>
        ))}
      </div>

      <div className="days-grid">
        {days.map((day) => {
          const dateKey = formatDateKey(day);
          const emotion = diaryDates.get(dateKey);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isDayToday = isToday(day);

          let className = 'day-cell';
          if (!isCurrentMonth) className += ' day-outside';
          if (isDayToday) className += ' day-today';
          if (isSelected) className += ' day-selected';

          return (
            <div
              key={dateKey}
              className={className}
              onClick={() => onDateSelect(day)}
            >
              <span className="day-number">{format(day, 'd')}</span>
              {emotion && (
                <div 
                  className="emotion-dot" 
                  style={{ backgroundColor: getEmotionColor(emotion) }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
