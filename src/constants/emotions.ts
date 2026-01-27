import type { EmotionInfo, EmotionKeyword } from '../types/emotion';
export type { EmotionCategory } from '../types/emotion';

export const EMOTIONS: EmotionInfo[] = [
  // 기존 6개 감정 (카테고리 추가)
  { id: 'sad', label: '슬픔', emoji: '😢', color: '#4A90D9', gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #1E40AF 100%)', category: 'negative' },
  { id: 'anxious', label: '불안', emoji: '😰', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #6D28D9 100%)', category: 'negative' },
  { id: 'angry', label: '화남', emoji: '😤', color: '#EF4444', gradient: 'linear-gradient(135deg, #F87171 0%, #EF4444 50%, #B91C1C 100%)', category: 'negative' },
  { id: 'depressed', label: '우울', emoji: '😔', color: '#6B7280', gradient: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 50%, #374151 100%)', category: 'negative' },
  { id: 'tired', label: '피곤', emoji: '🥱', color: '#F59E0B', gradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)', category: 'negative' },
  { id: 'calm', label: '차분', emoji: '😌', color: '#10B981', gradient: 'linear-gradient(135deg, #34D399 0%, #10B981 50%, #059669 100%)', category: 'neutral' },
  // 신규 긍정 감정 (positive: 3개)
  { id: 'happy', label: '행복', emoji: '😊', color: '#FBBF24', gradient: 'linear-gradient(135deg, #FDE68A 0%, #FBBF24 50%, #D97706 100%)', category: 'positive' },
  { id: 'excited', label: '설렘', emoji: '🤩', color: '#F472B6', gradient: 'linear-gradient(135deg, #F9A8D4 0%, #F472B6 50%, #DB2777 100%)', category: 'positive' },
  { id: 'grateful', label: '감사', emoji: '🙏', color: '#34D399', gradient: 'linear-gradient(135deg, #6EE7B7 0%, #34D399 50%, #059669 100%)', category: 'positive' },
  // 신규 중립 감정 (neutral: 5개)
  { id: 'nostalgic', label: '그리움', emoji: '🥹', color: '#818CF8', gradient: 'linear-gradient(135deg, #A5B4FC 0%, #818CF8 50%, #4F46E5 100%)', category: 'neutral' },
  { id: 'bittersweet', label: '아련', emoji: '💧', color: '#A78BFA', gradient: 'linear-gradient(135deg, #C4B5FD 0%, #A78BFA 50%, #7C3AED 100%)', category: 'neutral' },
  { id: 'cozy', label: '포근', emoji: '☕', color: '#FB923C', gradient: 'linear-gradient(135deg, #FDBA74 0%, #FB923C 50%, #EA580C 100%)', category: 'neutral' },
  { id: 'hopeful', label: '희망', emoji: '🌟', color: '#FACC15', gradient: 'linear-gradient(135deg, #FEF08A 0%, #FACC15 50%, #CA8A04 100%)', category: 'neutral' },
  { id: 'empty', label: '허무', emoji: '🕳️', color: '#94A3B8', gradient: 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 50%, #64748B 100%)', category: 'neutral' },
  // 신규 부정 감정 (negative: 4개)
  { id: 'lonely', label: '외로움', emoji: '😞', color: '#64748B', gradient: 'linear-gradient(135deg, #94A3B8 0%, #64748B 50%, #475569 100%)', category: 'negative' },
  { id: 'stressed', label: '스트레스', emoji: '😖', color: '#F87171', gradient: 'linear-gradient(135deg, #FCA5A5 0%, #F87171 50%, #DC2626 100%)', category: 'negative' },
  { id: 'frustrated', label: '답답함', emoji: '😤', color: '#FB7185', gradient: 'linear-gradient(135deg, #FDA4AF 0%, #FB7185 50%, #E11D48 100%)', category: 'negative' },
  { id: 'disappointed', label: '실망', emoji: '😕', color: '#A1A1AA', gradient: 'linear-gradient(135deg, #D4D4D8 0%, #A1A1AA 50%, #71717A 100%)', category: 'negative' },
];

// 감정 ID로 정보 찾기
export const getEmotionById = (id: EmotionKeyword): EmotionInfo | undefined => {
  return EMOTIONS.find((e) => e.id === id);
};

export const ALBUM_ART_MAP: Record<EmotionKeyword, string> = {
  sad: '/assets/album/album_sad.svg',
  anxious: '/assets/album/album_anxious.svg',
  angry: '/assets/album/album_angry.svg',
  depressed: '/assets/album/album_depressed.svg',
  tired: '/assets/album/album_tired.svg',
  calm: '/assets/album/album_calm.svg',
  happy: '/assets/album/album_happy.svg',
  excited: '/assets/album/album_excited.svg',
  grateful: '/assets/album/album_grateful.svg',
  nostalgic: '/assets/album/album_nostalgic.svg',
  bittersweet: '/assets/album/album_bittersweet.svg',
  cozy: '/assets/album/album_cozy.svg',
  hopeful: '/assets/album/album_hopeful.svg',
  empty: '/assets/album/album_empty.svg',
  lonely: '/assets/album/album_lonely.svg',
  stressed: '/assets/album/album_stressed.svg',
  frustrated: '/assets/album/album_frustrated.svg',
  disappointed: '/assets/album/album_disappointed.svg',
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

