import { Timestamp } from 'firebase-admin/firestore';

// 감정 키워드 타입
export type EmotionKeyword = 'sad' | 'anxious' | 'angry' | 'depressed' | 'tired' | 'calm';

// Firestore Track 문서
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
  createdAt: Timestamp;
  sunoTaskId: string;
  pairId?: string; // Suno가 생성한 페어 트랙 ID (A/B 곡 연결용)
}

// Firestore User 문서
export interface User {
  id: string;
  credits: number;
  lastCreditReset: Timestamp;
  tossUserId?: string;
  createdAt: Timestamp;
  trackCount: number;
}

// Suno API 응답 타입
export interface SunoGenerateResponse {
  task_id: string;
  status: string;
}

export interface SunoStatusResponse {
  status: 'pending' | 'processing' | 'complete' | 'failed';
  progress?: number;
  audio_url?: string;
  duration?: number;
  title?: string;
}

// Function 요청/응답 타입
export interface GenerateMusicRequest {
  emotion: EmotionKeyword;
  text?: string;
  instrumental?: boolean;
  musicType?: string;
  lyricsLanguage?: 'ko' | 'en';
}

export interface GenerateMusicResponse {
  taskId: string;
  userId: string;
}

export interface CheckStatusRequest {
  taskId: string;
  emotion: EmotionKeyword;
  emotionText?: string;
}

export interface CheckStatusResponse {
  status: string;
  progress?: number;
  track?: Track;
}

export interface GetMyTracksRequest {
  limit?: number;
  startAfter?: string;
}

export interface DeleteTrackRequest {
  trackId: string;
}

// 토스 로그인 요청/응답 타입
export interface TossLoginRequest {
  authorizationCode: string;
  referrer: 'DEFAULT' | 'SANDBOX';
}

export interface TossLoginResponse {
  customToken: string;
  userKey: number;
  isNewUser: boolean;
}

// 토스 API 응답 타입
export interface TossTokenResponse {
  resultType: 'SUCCESS' | 'FAIL';
  success?: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    scope: string;
  };
  error?: {
    errorCode: string;
    reason: string;
  };
}

export interface TossUserInfoResponse {
  resultType: 'SUCCESS' | 'FAIL';
  success?: {
    userKey: number;
    scope: string;
    agreedTerms: string[];
    name?: string;
    phone?: string;
    birthday?: string;
    ci?: string;
    di?: string;
    gender?: string;
    nationality?: string;
    email?: string;
  };
  error?: {
    errorCode: string;
    reason: string;
  };
}

// 인앱결제 크레딧 지급 요청/응답 타입
export interface GrantCreditsRequest {
  orderId: string;
  sku: string;
  credits: number; // 클라이언트 전달값 (서버에서 SKU로 검증)
}

export interface GrantCreditsResponse {
  success: boolean;
  credits: number;
  alreadyGranted?: boolean;
}







