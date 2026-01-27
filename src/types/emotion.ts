// 감정 키워드 타입 (18개: 기존 6개 + 신규 12개)
export type EmotionKeyword =
  // 기존 6개 (negative: 5, neutral: 1)
  | 'sad' | 'anxious' | 'angry' | 'depressed' | 'tired' | 'calm'
  // 신규 positive (3개)
  | 'happy' | 'excited' | 'grateful'
  // 신규 neutral (5개)
  | 'nostalgic' | 'bittersweet' | 'cozy' | 'hopeful' | 'empty'
  // 신규 negative (4개)
  | 'lonely' | 'stressed' | 'frustrated' | 'disappointed';

// 감정 카테고리 타입
export type EmotionCategory = 'positive' | 'neutral' | 'negative';

// Track 타입
export interface Track {
  id: string;
  userId: string;
  emotion: EmotionKeyword;
  emotionText?: string;
  title: string;
  description: string;
  audioUrl: string;
  albumArt: string;
  duration: number;
  createdAt: Date;
  sunoTaskId: string;
  pairId?: string; // Suno가 생성한 페어 트랙 ID (A/B 곡 연결용)
}

// User 타입
export interface User {
  id: string;
  credits: number;
  lastCreditReset: Date;
  tossUserId?: string;
  createdAt: Date;
  trackCount: number;
}

export interface EmotionInfo {
  id: EmotionKeyword;
  label: string;
  emoji: string;
  color: string;
  gradient: string;
  category: EmotionCategory;
}




















