import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import type { EmotionKeyword, Track } from '../types/emotion';

// Firebase 설정
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase 초기화
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 개발 환경에서 에뮬레이터 연결 (선택적)
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}

// Auth 헬퍼
export { signInAnonymously, signInWithCustomToken, onAuthStateChanged };
export type { User };

// Callable Functions 타입 정의
interface GenerateMusicRequest {
  emotion: EmotionKeyword;
  text?: string;
}

interface GenerateMusicResponse {
  taskId: string;
  userId: string;
}

interface CheckStatusRequest {
  taskId: string;
  emotion: EmotionKeyword;
  emotionText?: string;
}

interface CheckStatusResponse {
  status: string;
  progress?: number;
  track?: Track;
}

interface GetMyTracksRequest {
  limit?: number;
  startAfter?: string;
}

interface GetMyTracksResponse {
  tracks: Track[];
}

interface DeleteTrackRequest {
  trackId: string;
}

interface DeleteTrackResponse {
  success: boolean;
}

interface UserInfo {
  id: string;
  credits: number;
  lastCreditReset: { seconds: number };
  createdAt: { seconds: number };
  trackCount: number;
}

// Callable Functions
export const generateMusicFn = httpsCallable<GenerateMusicRequest, GenerateMusicResponse>(
  functions,
  'generateMusic'
);

export const checkAndSaveMusicFn = httpsCallable<CheckStatusRequest, CheckStatusResponse>(
  functions,
  'checkAndSaveMusic'
);

export const getMyTracksFn = httpsCallable<GetMyTracksRequest, GetMyTracksResponse>(
  functions,
  'getMyTracks'
);

export const deleteTrackFn = httpsCallable<DeleteTrackRequest, DeleteTrackResponse>(
  functions,
  'deleteTrack'
);

export const getUserInfoFn = httpsCallable<void, UserInfo>(functions, 'getUserInfo');

// 토스 로그인 타입
interface TossLoginRequest {
  authorizationCode: string;
  referrer: 'DEFAULT' | 'SANDBOX';
}

interface TossLoginResponse {
  customToken: string;
  userKey: number;
  isNewUser: boolean;
}

// 토스 로그인 Callable Function
export const loginWithTossFn = httpsCallable<TossLoginRequest, TossLoginResponse>(
  functions,
  'loginWithToss'
);

