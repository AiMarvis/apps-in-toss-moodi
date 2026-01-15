// 감정 키워드 타입
export type EmotionKeyword = 'sad' | 'anxious' | 'angry' | 'depressed' | 'tired' | 'calm';

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

// 감정 정보 타입
export interface EmotionInfo {
  id: EmotionKeyword;
  label: string;
  emoji: string;
  color: string;
}




















