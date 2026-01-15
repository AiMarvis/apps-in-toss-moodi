import { EmotionKeyword } from '../types';

// 감정별 음악 프롬프트 매핑
const EMOTION_PROMPTS: Record<EmotionKeyword, string> = {
  sad: 'melancholic piano melody with gentle strings, emotional and comforting, slow tempo',
  anxious: 'calming ambient soundscape with soft pads, peaceful and soothing, very slow tempo',
  angry: 'intense rhythmic instrumental with dramatic elements, cathartic and releasing',
  depressed: 'lo-fi beats with muted tones, warm and embracing, gentle percussion',
  tired: 'calm healing music with nature sounds, relaxing and restorative, peaceful',
  calm: 'peaceful acoustic guitar with nature ambience, serene and meditative',
};

// 감정별 제목 생성
const EMOTION_TITLES: Record<EmotionKeyword, string[]> = {
  sad: ['비 오는 날의 멜로디', '눈물의 위로', '슬픔을 담은 노래'],
  anxious: ['마음의 안식처', '평온의 순간', '고요한 밤'],
  angry: ['감정의 해방', '내면의 폭풍', '분노를 넘어서'],
  depressed: ['희미한 빛', '어둠 속 따뜻함', '조용한 위안'],
  tired: ['휴식의 선율', '지친 하루의 끝', '달콤한 안식'],
  calm: ['평화로운 시간', '고요한 숲', '맑은 하늘 아래'],
};

// 감정별 설명 생성
const EMOTION_DESCRIPTIONS: Record<EmotionKeyword, string> = {
  sad: '당신의 슬픔을 위로하는 곡',
  anxious: '불안한 마음을 달래주는 곡',
  angry: '분노를 해소시켜주는 곡',
  depressed: '우울한 기분을 감싸주는 곡',
  tired: '지친 당신을 위한 휴식의 곡',
  calm: '차분한 마음을 유지해주는 곡',
};

// 감정별 앨범 아트 URL
const ALBUM_ART_BASE = 'https://storage.googleapis.com/moodi-b8811.appspot.com/album-art';
const ALBUM_ART_MAP: Record<EmotionKeyword, string> = {
  sad: `${ALBUM_ART_BASE}/album_sad.png`,
  anxious: `${ALBUM_ART_BASE}/album_anxious.png`,
  angry: `${ALBUM_ART_BASE}/album_angry.png`,
  depressed: `${ALBUM_ART_BASE}/album_depressed.png`,
  tired: `${ALBUM_ART_BASE}/album_tired.png`,
  calm: `${ALBUM_ART_BASE}/album_calm.png`,
};

/**
 * 감정과 텍스트를 기반으로 음악 생성 프롬프트 생성
 */
export function buildMusicPrompt(emotion: EmotionKeyword, text?: string): string {
  const basePrompt = EMOTION_PROMPTS[emotion];
  
  if (!text || text.trim() === '') {
    return basePrompt;
  }
  
  // 텍스트가 있으면 추가 컨텍스트로 활용
  return `${basePrompt}, inspired by the feeling: "${text.substring(0, 100)}"`;
}

/**
 * 감정에 맞는 제목 생성 (랜덤 선택)
 */
export function generateTitle(emotion: EmotionKeyword): string {
  const titles = EMOTION_TITLES[emotion];
  const randomIndex = Math.floor(Math.random() * titles.length);
  return titles[randomIndex];
}

/**
 * 감정에 맞는 설명 생성
 */
export function generateDescription(emotion: EmotionKeyword): string {
  return EMOTION_DESCRIPTIONS[emotion];
}

/**
 * 감정에 맞는 앨범 아트 URL 반환
 */
export function getAlbumArt(emotion: EmotionKeyword): string {
  return ALBUM_ART_MAP[emotion];
}









