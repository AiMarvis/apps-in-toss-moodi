import type { EmotionKeyword } from './emotion';

/**
 * 감정 일기 엔트리 타입
 * - 캘린더에서 날짜별로 조회
 * - 음악 트랙과 연동 가능
 */
export interface DiaryEntry {
  id: string;
  userId: string;
  date: string; // ISO format (YYYY-MM-DD) for calendar querying
  emotion: EmotionKeyword;
  content: string; // 일기 내용
  trackId?: string; // 연결된 음악 트랙 ID (선택)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 캘린더 날짜 셀 데이터
 */
export interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
  isToday: boolean;
  diaries: DiaryEntry[];
}

/**
 * 월별 캘린더 데이터
 */
export interface CalendarMonth {
  year: number;
  month: number; // 0-indexed (0 = January)
  days: CalendarDay[];
}

/**
 * 다이어리 생성 요청
 */
export interface CreateDiaryRequest {
  date: string;
  emotion: EmotionKeyword;
  content: string;
  trackId?: string;
}

/**
 * 다이어리 조회 필터
 */
export interface DiaryFilter {
  year: number;
  month: number;
}
