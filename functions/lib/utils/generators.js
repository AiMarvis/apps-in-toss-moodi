"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMusicPrompt = buildMusicPrompt;
exports.generateTitle = generateTitle;
exports.generateDescription = generateDescription;
exports.getAlbumArt = getAlbumArt;
// 감정별 음악 프롬프트 매핑
const EMOTION_PROMPTS = {
    sad: 'melancholic piano melody with gentle strings, emotional and comforting, slow tempo',
    anxious: 'calming ambient soundscape with soft pads, peaceful and soothing, very slow tempo',
    angry: 'intense rhythmic instrumental with dramatic elements, cathartic and releasing',
    depressed: 'lo-fi beats with muted tones, warm and embracing, gentle percussion',
    tired: 'calm healing music with nature sounds, relaxing and restorative, peaceful',
    calm: 'peaceful acoustic guitar with nature ambience, serene and meditative',
};
// 음악 스타일별 프롬프트 매핑
const MUSIC_STYLE_PROMPTS = {
    calm: 'calm and peaceful, gentle tempo, soft dynamics',
    upbeat: 'upbeat and energetic, fast tempo, lively rhythm',
    dramatic: 'dramatic and cinematic, dynamic changes, orchestral elements',
    jazz: 'jazz style, smooth saxophone, walking bass, swing rhythm',
    classical: 'classical style, orchestral arrangement, elegant strings',
    lofi: 'lo-fi hip hop, mellow beats, vinyl crackle, chill vibes',
};
// 감정별 가사 힌트 (가사 포함 시 사용)
const EMOTION_LYRICS_HINTS = {
    sad: 'with heartfelt lyrics about loss and longing',
    anxious: 'with calming lyrics about finding peace and comfort',
    angry: 'with powerful lyrics about overcoming frustration',
    depressed: 'with hopeful lyrics about light in darkness',
    tired: 'with soothing lyrics about rest and relaxation',
    calm: 'with gentle lyrics about serenity and contentment',
};
// 감정별 제목 생성
const EMOTION_TITLES = {
    sad: ['비 오는 날의 멜로디', '눈물의 위로', '슬픔을 담은 노래'],
    anxious: ['마음의 안식처', '평온의 순간', '고요한 밤'],
    angry: ['감정의 해방', '내면의 폭풍', '분노를 넘어서'],
    depressed: ['희미한 빛', '어둠 속 따뜻함', '조용한 위안'],
    tired: ['휴식의 선율', '지친 하루의 끝', '달콤한 안식'],
    calm: ['평화로운 시간', '고요한 숲', '맑은 하늘 아래'],
};
// 감정별 설명 생성
const EMOTION_DESCRIPTIONS = {
    sad: '당신의 슬픔을 위로하는 곡',
    anxious: '불안한 마음을 달래주는 곡',
    angry: '분노를 해소시켜주는 곡',
    depressed: '우울한 기분을 감싸주는 곡',
    tired: '지친 당신을 위한 휴식의 곡',
    calm: '차분한 마음을 유지해주는 곡',
};
// 감정별 앨범 아트 URL
const ALBUM_ART_BASE = 'https://storage.googleapis.com/moodi-b8811.appspot.com/album-art';
const ALBUM_ART_MAP = {
    sad: `${ALBUM_ART_BASE}/album_sad.png`,
    anxious: `${ALBUM_ART_BASE}/album_anxious.png`,
    angry: `${ALBUM_ART_BASE}/album_angry.png`,
    depressed: `${ALBUM_ART_BASE}/album_depressed.png`,
    tired: `${ALBUM_ART_BASE}/album_tired.png`,
    calm: `${ALBUM_ART_BASE}/album_calm.png`,
};
/**
 * 감정과 텍스트를 기반으로 음악 생성 프롬프트 생성
 * @param emotion - 감정 키워드
 * @param text - 사용자 입력 텍스트 (선택)
 * @param musicType - 음악 스타일 (선택)
 * @param instrumental - 연주곡 여부 (true면 가사 힌트 제외)
 */
function buildMusicPrompt(emotion, text, musicType, instrumental) {
    const basePrompt = EMOTION_PROMPTS[emotion];
    const stylePrompt = musicType ? MUSIC_STYLE_PROMPTS[musicType] : '';
    const lyricsHint = !instrumental ? EMOTION_LYRICS_HINTS[emotion] : '';
    let prompt = basePrompt;
    // 스타일 추가 (스타일이 있으면 맨 앞에)
    if (stylePrompt) {
        prompt = `${stylePrompt}, ${prompt}`;
    }
    // 가사 힌트 추가 (가사 포함 시)
    if (lyricsHint) {
        prompt = `${prompt}, ${lyricsHint}`;
    }
    // 사용자 텍스트 추가
    if (text === null || text === void 0 ? void 0 : text.trim()) {
        prompt = `${prompt}, inspired by the feeling: "${text.substring(0, 100)}"`;
    }
    return prompt;
}
/**
 * 감정에 맞는 제목 생성 (랜덤 선택)
 */
function generateTitle(emotion) {
    const titles = EMOTION_TITLES[emotion];
    const randomIndex = Math.floor(Math.random() * titles.length);
    return titles[randomIndex];
}
/**
 * 감정에 맞는 설명 생성
 */
function generateDescription(emotion) {
    return EMOTION_DESCRIPTIONS[emotion];
}
/**
 * 감정에 맞는 앨범 아트 URL 반환
 */
function getAlbumArt(emotion) {
    return ALBUM_ART_MAP[emotion];
}
//# sourceMappingURL=generators.js.map