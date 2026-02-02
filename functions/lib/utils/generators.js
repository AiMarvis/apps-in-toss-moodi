"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildShortKoreanPrompt = buildShortKoreanPrompt;
exports.buildMusicPrompt = buildMusicPrompt;
exports.generateTitle = generateTitle;
exports.generateDescription = generateDescription;
exports.getAlbumArt = getAlbumArt;
const EMOTION_PROMPTS = {
    sad: 'melancholic piano melody with gentle strings, emotional and comforting, slow tempo',
    anxious: 'calming ambient soundscape with soft pads, peaceful and soothing, very slow tempo',
    angry: 'intense rhythmic instrumental with dramatic elements, cathartic and releasing',
    depressed: 'lo-fi beats with muted tones, warm and embracing, gentle percussion',
    tired: 'calm healing music with nature sounds, relaxing and restorative, peaceful',
    calm: 'peaceful acoustic guitar with nature ambience, serene and meditative',
    happy: 'uplifting acoustic melody with bright piano and cheerful strings, joyful and warm',
    excited: 'energetic pop instrumental with dynamic beats, playful and anticipatory',
    grateful: 'warm orchestral arrangement with gentle harp and thankful tone, heartfelt',
    nostalgic: 'dreamy ambient with vintage synths, bittersweet memories and longing',
    bittersweet: 'melancholic yet beautiful piano with soft strings, wistful and tender',
    cozy: 'warm acoustic guitar with soft percussion, comfortable and embracing',
    hopeful: 'inspiring piano melody building to uplifting crescendo, optimistic',
    empty: 'minimal ambient soundscape with sparse piano, reflective and hollow',
    lonely: 'intimate acoustic with solo instrument, isolated yet comforting',
    stressed: 'tense building instrumental releasing into calm resolution, cathartic',
    frustrated: 'rhythmic intensity with dynamic shifts, releasing and empowering',
    disappointed: 'gentle melancholic piano, processing and accepting, soft resolution',
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
const EMOTION_LYRICS_HINTS_EN = {
    sad: 'with heartfelt English vocals about loss and longing',
    anxious: 'with calming English vocals about finding peace and comfort',
    angry: 'with powerful English vocals about overcoming frustration',
    depressed: 'with hopeful English vocals about light in darkness',
    tired: 'with soothing English vocals about rest and relaxation',
    calm: 'with gentle English vocals about serenity and contentment',
    happy: 'with joyful English vocals about happiness and celebration',
    excited: 'with energetic English vocals about anticipation and thrill',
    grateful: 'with warm English vocals about appreciation and thankfulness',
    nostalgic: 'with wistful English vocals about cherished memories',
    bittersweet: 'with tender English vocals about beauty in sadness',
    cozy: 'with soft English vocals about comfort and warmth',
    hopeful: 'with uplifting English vocals about bright tomorrows',
    empty: 'with reflective English vocals about searching for meaning',
    lonely: 'with intimate English vocals about solitude and connection',
    stressed: 'with releasing English vocals about finding calm',
    frustrated: 'with empowering English vocals about breaking through',
    disappointed: 'with gentle English vocals about acceptance and moving on',
};
// ========================================
// 한국어 가사 품질 향상을 위한 상수들
// ========================================
const KOREAN_VOCAL_STYLES = {
    sad: 'Korean ballad vocalist with emotional vibrato and controlled breathing (감성 발라드 창법), ' +
        'soulful interpretation like IU/Taeyeon style, vulnerable falsetto transitions, ' +
        'clear Korean diction with natural Seoul accent',
    anxious: 'soft healing vocals (힐링 보컬) with whispery tone and ASMR-like intimacy, ' +
        'K-indie gentle delivery reminiscent of 10cm/Cheeze, ' +
        'comforting melodic phrasing with sustained vowels in Korean',
    angry: 'powerful Korean rock vocals with gritty texture and dynamic range, ' +
        'dramatic K-rock delivery similar to Hyukoh, ' +
        'intense emotional release with strong consonant articulation',
    depressed: 'introspective Korean R&B/soul vocals with melancholic tone (애절한 음색), ' +
        'lo-fi K-hip hop influenced vocal style like Heize/Dean, ' +
        'intimate storytelling delivery with conversational Korean phrasing',
    tired: 'gentle lullaby-like Korean vocals (자장가 같은 목소리) with slow vibrato, ' +
        'warm timbre, OST ballad style with comforting presence, ' +
        'soft consonants and smooth vowel transitions',
    calm: 'peaceful Korean meditation vocals with serene tone, ' +
        'nature-inspired K-folk delivery, ' +
        'clear enunciation with mindful breathing and natural Korean flow',
    happy: 'bright Korean pop vocals with cheerful tone and playful delivery, ' +
        'upbeat K-pop style with joyful energy, ' +
        'clear articulation with natural smiling voice quality',
    excited: 'energetic Korean pop vocals with dynamic range and anticipatory tone, ' +
        'youthful K-pop delivery with building excitement, ' +
        'expressive vowels and rhythmic phrasing',
    grateful: 'warm Korean ballad vocals with thankful sincerity (감사한 마음), ' +
        'heartfelt OST style with emotional depth, ' +
        'gentle vibrato and clear Korean expressions',
    nostalgic: 'wistful Korean vocals with dreamy quality (꿈결 같은 목소리), ' +
        'retro K-ballad style reminiscent of classic songs, ' +
        'longing tone with sustained phrases',
    bittersweet: 'tender Korean vocals with delicate emotional balance, ' +
        'melancholic yet beautiful delivery like acoustic ballads, ' +
        'subtle vibrato with poignant phrasing',
    cozy: 'soft Korean vocals with warm intimate tone (따뜻한 목소리), ' +
        'acoustic cafe music style with comfortable presence, ' +
        'gentle delivery with natural conversational flow',
    hopeful: 'uplifting Korean vocals building with optimism, ' +
        'inspiring OST ballad style with crescendo delivery, ' +
        'bright vowels and encouraging tone',
    empty: 'minimal Korean vocals with reflective hollow quality, ' +
        'introspective indie style with sparse phrasing, ' +
        'contemplative delivery with meaningful pauses',
    lonely: 'intimate Korean vocals with isolated vulnerable quality, ' +
        'solo acoustic style with personal delivery, ' +
        'quiet consonants and seeking tone',
    stressed: 'tense Korean vocals releasing into calm resolution, ' +
        'building intensity then relief, cathartic K-rock influenced, ' +
        'dynamic shifts in delivery',
    frustrated: 'powerful Korean vocals with restrained then released emotion, ' +
        'intense articulation breaking into freedom, ' +
        'empowering delivery with strong phrases',
    disappointed: 'gentle Korean vocals processing with acceptance, ' +
        'soft melancholic ballad style with resignation, ' +
        'subtle sadness with peaceful resolution',
};
const KOREAN_LYRICAL_NARRATIVES = {
    sad: 'lyrics exploring themes of longing and separation (이별과 그리움), ' +
        'poetic imagery of rain and fading seasons (비 내리는 밤, 계절의 끝), ' +
        'narrative arc from heartbreak to bittersweet acceptance, ' +
        'Korean expressions like "보고 싶어요" and "미안해요" woven naturally, ' +
        'verse-chorus structure with reflective bridge about memories',
    anxious: 'lyrics about finding inner peace through uncertainty, ' +
        'imagery of gentle waves, slow breathing, morning light (잔잔한 파도, 아침 햇살), ' +
        'reassuring narrative with "괜찮아질 거야" and "천천히 가도 돼", ' +
        'soft verse building to hopeful chorus, meditative bridge',
    angry: 'lyrics about releasing pent-up emotions and breaking free, ' +
        'powerful imagery of storms, breaking chains (폭풍, 끊어진 사슬), ' +
        'cathartic journey from frustration to empowerment, ' +
        'strong Korean expressions like "이젠 충분해" and "나를 찾겠어"',
    depressed: 'lyrics exploring darkness while seeking small lights of hope, ' +
        'imagery of fog and grey skies gradually brightening (안개, 작은 별), ' +
        'honest narrative: "힘들어도 괜찮아", "혼자가 아니야", ' +
        'gentle verse-chorus with uplifting bridge about tomorrow',
    tired: 'lyrics about rest, letting go, and gentle restoration, ' +
        'soothing imagery of sunset, quiet night (노을, 고요한 밤), ' +
        'comforting narrative: "이제 쉬어도 돼", "충분히 잘 했어", ' +
        'lullaby-like verse structure with reassuring chorus',
    calm: 'lyrics celebrating present moment peace and gratitude, ' +
        'nature imagery of forest, flowing water, clear sky (숲, 흐르는 물), ' +
        'meditative narrative: "지금 이 순간", "고마워요", ' +
        'serene verse-chorus with reflective bridge about mindfulness',
    happy: 'lyrics celebrating joy and bright moments (행복한 순간), ' +
        'imagery of sunshine, laughter, dancing (햇살, 웃음), ' +
        'joyful narrative: "오늘이 좋아", "함께라서 행복해", ' +
        'upbeat verse-chorus with celebratory bridge',
    excited: 'lyrics about anticipation and thrilling moments (설레는 마음), ' +
        'imagery of new beginnings, butterflies (새로운 시작, 두근거림), ' +
        'building narrative: "기다려왔어", "드디어 이 순간", ' +
        'dynamic verse building to energetic chorus',
    grateful: 'lyrics expressing deep appreciation and thankfulness (감사한 마음), ' +
        'imagery of warm embrace, shared moments (따뜻한 포옹, 함께한 시간), ' +
        'heartfelt narrative: "고마워요", "당신 덕분에", ' +
        'warm verse-chorus with reflective gratitude bridge',
    nostalgic: 'lyrics exploring cherished memories and longing (추억과 그리움), ' +
        'imagery of old photos, past seasons (오래된 사진, 지난 계절), ' +
        'wistful narrative: "그때가 그리워", "다시 돌아갈 수 있다면", ' +
        'dreamy verse with bittersweet chorus',
    bittersweet: 'lyrics about beauty in sadness and tender moments (아련한 감정), ' +
        'imagery of fading sunsets, gentle rain (지는 해, 잔잔한 비), ' +
        'delicate narrative: "아프지만 아름다워", "잊지 않을게", ' +
        'tender verse-chorus with emotional bridge',
    cozy: 'lyrics about comfort and warmth (포근한 순간), ' +
        'imagery of warm blankets, quiet evenings (따뜻한 이불, 조용한 저녁), ' +
        'comforting narrative: "편안해", "여기가 좋아", ' +
        'soft verse-chorus with intimate bridge',
    hopeful: 'lyrics about believing in tomorrow (희망을 품고), ' +
        'imagery of rising sun, new paths (떠오르는 해, 새로운 길), ' +
        'inspiring narrative: "내일은 달라질 거야", "포기하지 마", ' +
        'building verse to uplifting crescendo chorus',
    empty: 'lyrics exploring hollowness and searching (허무한 마음), ' +
        'imagery of empty rooms, echoes (빈 방, 메아리), ' +
        'reflective narrative: "왜 이렇게 텅 빈 걸까", "무엇을 찾고 있을까", ' +
        'sparse verse with contemplative chorus',
    lonely: 'lyrics about solitude and yearning for connection (외로운 밤), ' +
        'imagery of empty streets, single footsteps (빈 거리, 홀로 걷는 발걸음), ' +
        'intimate narrative: "누군가 곁에 있었으면", "혼자라는 느낌", ' +
        'quiet verse-chorus with vulnerable bridge',
    stressed: 'lyrics about tension releasing into peace (스트레스 해소), ' +
        'imagery of storms clearing, deep breaths (폭풍 후 고요, 깊은 숨), ' +
        'cathartic narrative: "이제 놓아줘", "괜찮아질 거야", ' +
        'tense verse releasing into calm chorus',
    frustrated: 'lyrics about breaking through barriers (답답함을 넘어), ' +
        'imagery of walls crumbling, finding voice (무너지는 벽, 외치는 목소리), ' +
        'empowering narrative: "더 이상 참지 않아", "내 길을 갈 거야", ' +
        'building verse to liberating chorus',
    disappointed: 'lyrics about acceptance and moving forward (실망을 딛고), ' +
        'imagery of closing doors, new horizons (닫히는 문, 새로운 지평), ' +
        'gentle narrative: "괜찮아, 다음이 있어", "배움이었어", ' +
        'soft verse-chorus with accepting bridge',
};
const EMOTION_PROMPTS_ENHANCED = {
    sad: 'emotional K-ballad with melancholic piano arpeggios and tender string quartet, ' +
        'slow tempo (65-75 BPM), gentle acoustic guitar fingerpicking, subtle cello, ' +
        'dynamic build from intimate verse to emotional chorus, cinematic production',
    anxious: 'calming K-indie ambient soundscape with soft synth pads and warm bass, ' +
        'very slow tempo (55-65 BPM), delicate guitar harmonics, ' +
        'lo-fi production aesthetic with vinyl warmth, peaceful and enveloping',
    angry: 'powerful Korean rock with driving electric guitar and dynamic drums, ' +
        'moderate-fast tempo (110-130 BPM), distorted guitar riffs, ' +
        'cathartic bridge breakdown, raw yet polished production',
    depressed: 'introspective K-R&B/lo-fi hip hop with muted jazz chords and gentle beats, ' +
        'slow tempo (70-80 BPM), warm Rhodes piano, vinyl crackle, ' +
        'minimalist percussion, melancholic yet comforting atmosphere',
    tired: 'soothing healing music with acoustic guitar, soft piano, nature ambience, ' +
        'very slow tempo (50-60 BPM), gentle rain or forest sounds, ' +
        'lullaby-like arrangement, restorative and peaceful',
    calm: 'serene K-folk with acoustic guitar, gentle kalimba, nature soundscape, ' +
        'slow-medium tempo (65-75 BPM), fingerstyle guitar, ' +
        'meditative arrangement with breath-like phrasing, natural production',
    happy: 'uplifting K-pop with bright synths and cheerful acoustic elements, ' +
        'upbeat tempo (100-120 BPM), playful percussion, joyful strings, ' +
        'celebratory arrangement with feel-good energy',
    excited: 'energetic K-pop with building synths and dynamic beats, ' +
        'fast tempo (120-140 BPM), anticipatory brass, rising strings, ' +
        'thrilling arrangement with explosive drops',
    grateful: 'warm K-ballad with heartfelt strings and gentle piano, ' +
        'medium tempo (75-85 BPM), thankful choir elements, ' +
        'sincere arrangement with emotional crescendo',
    nostalgic: 'dreamy retro K-pop with vintage synths and warm reverb, ' +
        'medium tempo (80-90 BPM), nostalgic guitar tones, ' +
        'wistful arrangement with bittersweet melodies',
    bittersweet: 'delicate K-indie with tender piano and soft strings, ' +
        'slow tempo (60-70 BPM), melancholic beauty, ' +
        'gentle arrangement balancing sadness and hope',
    cozy: 'warm acoustic cafe music with soft guitar and gentle percussion, ' +
        'relaxed tempo (70-80 BPM), intimate production, ' +
        'comfortable arrangement with homey feel',
    hopeful: 'inspiring K-ballad building to uplifting crescendo, ' +
        'medium-fast tempo (85-100 BPM), soaring strings, triumphant brass, ' +
        'optimistic arrangement with powerful resolution',
    empty: 'minimal ambient with sparse piano and hollow reverb, ' +
        'very slow tempo (45-55 BPM), contemplative silence, ' +
        'reflective arrangement with meaningful space',
    lonely: 'intimate acoustic with solo guitar and vulnerable vocals, ' +
        'slow tempo (55-65 BPM), isolated production, ' +
        'personal arrangement seeking connection',
    stressed: 'tense building arrangement releasing into calm resolution, ' +
        'variable tempo building then slowing, cathartic transition, ' +
        'dynamic arrangement from tension to peace',
    frustrated: 'intense K-rock building to liberating release, ' +
        'moderate-fast tempo (100-120 BPM), restrained power, ' +
        'empowering arrangement breaking free',
    disappointed: 'gentle melancholic ballad with accepting resolution, ' +
        'slow tempo (60-70 BPM), soft piano and strings, ' +
        'processing arrangement moving toward peace',
};
const EMOTION_TITLES = {
    sad: ['비 오는 날의 멜로디', '눈물의 위로', '슬픔을 담은 노래'],
    anxious: ['마음의 안식처', '평온의 순간', '고요한 밤'],
    angry: ['감정의 해방', '내면의 폭풍', '분노를 넘어서'],
    depressed: ['희미한 빛', '어둠 속 따뜻함', '조용한 위안'],
    tired: ['휴식의 선율', '지친 하루의 끝', '달콤한 안식'],
    calm: ['평화로운 시간', '고요한 숲', '맑은 하늘 아래'],
    happy: ['행복의 노래', '기쁨의 순간', '환한 미소'],
    excited: ['설레는 마음', '두근두근', '기대되는 하루'],
    grateful: ['감사의 멜로디', '고마운 마음', '따뜻한 기억'],
    nostalgic: ['추억의 노래', '그리운 날들', '옛 시간 속으로'],
    bittersweet: ['아련한 감정', '달콤쓴 기억', '눈물 어린 미소'],
    cozy: ['포근한 순간', '따뜻한 하루', '아늑한 시간'],
    hopeful: ['희망의 빛', '내일을 향해', '새로운 시작'],
    empty: ['텅 빈 마음', '고요한 공허', '찾고 있는 것'],
    lonely: ['외로운 밤', '혼자인 시간', '그리움의 노래'],
    stressed: ['긴장의 끝', '마음의 휴식', '평온으로'],
    frustrated: ['답답함을 넘어', '해방의 순간', '내 길을 찾아'],
    disappointed: ['실망의 끝에서', '다시 시작', '받아들임의 노래'],
};
const EMOTION_DESCRIPTIONS = {
    sad: '당신의 슬픔을 위로하는 곡',
    anxious: '불안한 마음을 달래주는 곡',
    angry: '분노를 해소시켜주는 곡',
    depressed: '우울한 기분을 감싸주는 곡',
    tired: '지친 당신을 위한 휴식의 곡',
    calm: '차분한 마음을 유지해주는 곡',
    happy: '행복한 순간을 더욱 빛나게 하는 곡',
    excited: '설레는 마음을 담은 곡',
    grateful: '감사한 마음을 전하는 곡',
    nostalgic: '추억을 되새기는 곡',
    bittersweet: '아련한 감정을 담은 곡',
    cozy: '포근함을 느끼게 해주는 곡',
    hopeful: '희망을 품게 해주는 곡',
    empty: '텅 빈 마음을 위로하는 곡',
    lonely: '외로운 밤을 함께하는 곡',
    stressed: '스트레스를 풀어주는 곡',
    frustrated: '답답함을 해소해주는 곡',
    disappointed: '실망을 위로하는 곡',
};
// ========================================
// V5 최적화된 짧은 한국어 프롬프트 (500자 이내)
// customMode: false 사용 시 Suno가 자동으로 한국어 가사 생성
// ========================================
const KOREAN_SHORT_PROMPTS = {
    sad: '언어: 한국어(한글만). 감정: 슬픔, 그리움. 장르: K-발라드, 피아노. 분위기: 감성적, 위로. 템포: 느림(65BPM). 구조: Verse-Chorus-Bridge. 주제: 이별과 눈물. 영어 금지.',
    anxious: '언어: 한국어(한글만). 감정: 불안, 평온 찾기. 장르: K-인디, 어쿠스틱. 분위기: 차분, 힐링. 템포: 매우느림(55BPM). 구조: Verse-Chorus. 주제: 마음의 안식. 영어 금지.',
    angry: '언어: 한국어(한글만). 감정: 분노, 해방. 장르: K-록, 일렉트릭 기타. 분위기: 강렬, 카타르시스. 템포: 빠름(120BPM). 구조: Verse-Chorus-Bridge. 주제: 감정 폭발. 영어 금지.',
    depressed: '언어: 한국어(한글만). 감정: 우울, 희망. 장르: K-R&B, 로파이. 분위기: 몽환적, 따뜻함. 템포: 느림(70BPM). 구조: Verse-Chorus. 주제: 어둠 속 빛. 영어 금지.',
    tired: '언어: 한국어(한글만). 감정: 피로, 휴식. 장르: 발라드, 어쿠스틱. 분위기: 포근, 자장가. 템포: 매우느림(50BPM). 구조: Verse-Chorus. 주제: 쉼과 위로. 영어 금지.',
    calm: '언어: 한국어(한글만). 감정: 평온, 감사. 장르: K-포크, 어쿠스틱 기타. 분위기: 명상적, 자연. 템포: 느림(65BPM). 구조: Verse-Chorus. 주제: 고요한 순간. 영어 금지.',
    happy: '언어: 한국어(한글만). 감정: 행복, 기쁨. 장르: K-팝, 어쿠스틱. 분위기: 밝음, 경쾌. 템포: 빠름(110BPM). 구조: Verse-Chorus-Bridge. 주제: 즐거운 하루. 영어 금지.',
    excited: '언어: 한국어(한글만). 감정: 설렘, 기대. 장르: K-팝, 신스. 분위기: 에너지, 두근거림. 템포: 빠름(130BPM). 구조: Verse-Chorus-Drop. 주제: 새로운 시작. 영어 금지.',
    grateful: '언어: 한국어(한글만). 감정: 감사, 따뜻함. 장르: K-발라드, 오케스트라. 분위기: 진심, 감동. 템포: 중간(80BPM). 구조: Verse-Chorus-Bridge. 주제: 고마운 마음. 영어 금지.',
    nostalgic: '언어: 한국어(한글만). 감정: 그리움, 추억. 장르: 레트로 K-팝, 신스. 분위기: 몽환적, 아련함. 템포: 중간(85BPM). 구조: Verse-Chorus. 주제: 지난 시간. 영어 금지.',
    bittersweet: '언어: 한국어(한글만). 감정: 씁쓸함, 아름다움. 장르: K-인디, 피아노. 분위기: 섬세, 감성. 템포: 느림(60BPM). 구조: Verse-Chorus. 주제: 아픈 기억. 영어 금지.',
    cozy: '언어: 한국어(한글만). 감정: 포근함, 편안. 장르: 어쿠스틱, 카페음악. 분위기: 따뜻, 아늑. 템포: 느림(70BPM). 구조: Verse-Chorus. 주제: 일상의 행복. 영어 금지.',
    hopeful: '언어: 한국어(한글만). 감정: 희망, 용기. 장르: K-발라드, 오케스트라. 분위기: 감동, 고양. 템포: 중간(90BPM). 구조: Verse-Chorus-Bridge. 주제: 밝은 내일. 영어 금지.',
    empty: '언어: 한국어(한글만). 감정: 공허, 성찰. 장르: 앰비언트, 미니멀 피아노. 분위기: 고요, 사색. 템포: 매우느림(45BPM). 구조: Verse-Chorus. 주제: 텅 빈 마음. 영어 금지.',
    lonely: '언어: 한국어(한글만). 감정: 외로움, 그리움. 장르: K-발라드, 솔로 기타. 분위기: 쓸쓸함, 내밀함. 템포: 느림(55BPM). 구조: Verse-Chorus. 주제: 혼자인 밤. 영어 금지.',
    stressed: '언어: 한국어(한글만). 감정: 긴장→해소. 장르: K-록→발라드. 분위기: 긴장에서 평온으로. 템포: 변화(빠름→느림). 구조: Verse-Chorus-Bridge. 주제: 스트레스 해방. 영어 금지.',
    frustrated: '언어: 한국어(한글만). 감정: 답답함, 돌파. 장르: K-록, 강렬. 분위기: 억눌림→해방. 템포: 빠름(115BPM). 구조: Verse-Chorus-Bridge. 주제: 한계 극복. 영어 금지.',
    disappointed: '언어: 한국어(한글만). 감정: 실망, 수용. 장르: K-발라드, 피아노. 분위기: 쓸쓸, 받아들임. 템포: 느림(60BPM). 구조: Verse-Chorus. 주제: 새 출발. 영어 금지.',
};
/**
 * V5용 짧은 한국어 프롬프트 생성 (500자 이내)
 * customMode: false 사용 시 Suno가 자동으로 한국어 가사 생성
 */
function buildShortKoreanPrompt(emotion, text, musicType) {
    let prompt = KOREAN_SHORT_PROMPTS[emotion];
    // 음악 스타일 오버라이드 (있으면)
    if (musicType && MUSIC_STYLE_PROMPTS[musicType]) {
        prompt = prompt.replace(/장르: [^.]+\./, `장르: ${musicType}.`);
    }
    // 사용자 텍스트 추가 (짧게)
    if (text === null || text === void 0 ? void 0 : text.trim()) {
        const shortText = text.substring(0, 50);
        prompt = `${prompt} 영감: "${shortText}"`;
    }
    // 500자 제한
    return prompt.substring(0, 500);
}
const ALBUM_ART_MAP = {
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
/**
 * 감정과 텍스트를 기반으로 음악 생성 프롬프트 생성
 * @param emotion - 감정 키워드
 * @param text - 사용자 입력 텍스트 (선택)
 * @param musicType - 음악 스타일 (선택)
 * @param instrumental - 연주곡 여부 (true면 가사 힌트 제외)
 */
function buildMusicPrompt(emotion, text, musicType, instrumental, lyricsLanguage) {
    // 한국어 가사 요청 시 향상된 프롬프트 사용
    if (!instrumental && lyricsLanguage === 'ko') {
        let prompt = EMOTION_PROMPTS_ENHANCED[emotion];
        // 음악 스타일 추가
        if (musicType && MUSIC_STYLE_PROMPTS[musicType]) {
            prompt = `${MUSIC_STYLE_PROMPTS[musicType]}, ${prompt}`;
        }
        // 한국어 보컬 스타일 + 가사 내러티브 추가
        const vocalStyle = KOREAN_VOCAL_STYLES[emotion];
        const lyricalNarrative = KOREAN_LYRICAL_NARRATIVES[emotion];
        prompt = `${prompt}, featuring ${vocalStyle}, ${lyricalNarrative}`;
        // 한국어 노래 명시
        prompt = `${prompt}, sung entirely in Korean language (한국어로 노래)`;
        // 사용자 텍스트 추가
        if (text === null || text === void 0 ? void 0 : text.trim()) {
            prompt = `${prompt}, inspired by: "${text.substring(0, 100)}"`;
        }
        return prompt;
    }
    // 기존 로직 (영어 가사 및 연주곡)
    const basePrompt = EMOTION_PROMPTS[emotion];
    const stylePrompt = musicType ? MUSIC_STYLE_PROMPTS[musicType] : '';
    let lyricsHint = '';
    if (!instrumental) {
        lyricsHint = EMOTION_LYRICS_HINTS_EN[emotion];
    }
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