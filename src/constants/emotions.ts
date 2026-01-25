import type { EmotionInfo, EmotionKeyword } from '../types/emotion';

// 6개 감정 키워드 정의 (PRD 5.1.2)
export const EMOTIONS: EmotionInfo[] = [
  { id: 'sad', label: '슬픔', emoji: '😢', color: '#4A90D9', gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #1E40AF 100%)' },
  { id: 'anxious', label: '불안', emoji: '😰', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #6D28D9 100%)' },
  { id: 'angry', label: '화남', emoji: '😤', color: '#EF4444', gradient: 'linear-gradient(135deg, #F87171 0%, #EF4444 50%, #B91C1C 100%)' },
  { id: 'depressed', label: '우울', emoji: '😔', color: '#6B7280', gradient: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 50%, #374151 100%)' },
  { id: 'tired', label: '피곤', emoji: '🥱', color: '#F59E0B', gradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)' },
  { id: 'calm', label: '차분', emoji: '😌', color: '#10B981', gradient: 'linear-gradient(135deg, #34D399 0%, #10B981 50%, #059669 100%)' },
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

// 첫 가입 시 증정 크레딧
export const INITIAL_CREDITS = 5;

// 크레딧 상품 타입 (인앱결제용)
export interface CreditProduct {
  sku: string;
  amount: number;
  price: number;
  popular?: boolean;
}

// 크레딧 상품 목록
export const CREDIT_PRODUCTS: CreditProduct[] = [
  { sku: 'moodi.credit.10', amount: 10, price: 3300 },
  { sku: 'moodi.credit.33', amount: 33, price: 9900, popular: true },
];

