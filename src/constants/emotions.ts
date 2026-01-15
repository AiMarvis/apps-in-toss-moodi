import type { EmotionInfo, EmotionKeyword } from '../types/emotion';

// 6개 감정 키워드 정의 (PRD 5.1.2)
export const EMOTIONS: EmotionInfo[] = [
  { id: 'sad', label: '슬픔', emoji: '😢', color: '#4A90D9' },
  { id: 'anxious', label: '불안', emoji: '😰', color: '#8B5CF6' },
  { id: 'angry', label: '화남', emoji: '😤', color: '#EF4444' },
  { id: 'depressed', label: '우울', emoji: '😔', color: '#6B7280' },
  { id: 'tired', label: '피곤', emoji: '🥱', color: '#F59E0B' },
  { id: 'calm', label: '차분', emoji: '😌', color: '#10B981' },
];

// 감정 ID로 정보 찾기
export const getEmotionById = (id: EmotionKeyword): EmotionInfo | undefined => {
  return EMOTIONS.find((e) => e.id === id);
};

// 앨범 아트 URL 매핑 (로컬 SVG 에셋)
export const ALBUM_ART_MAP: Record<EmotionKeyword, string> = {
  sad: '/assets/album/album_sad.svg',
  anxious: '/assets/album/album_anxious.svg',
  angry: '/assets/album/album_angry.svg',
  depressed: '/assets/album/album_depressed.svg',
  tired: '/assets/album/album_tired.svg',
  calm: '/assets/album/album_calm.svg',
};

// 일일 무료 크레딧
export const DAILY_CREDITS = 5;

