# 무디 (Moodi) 🎵

> AI가 당신의 감정에 맞는 음악을 만들어드려요

무디는 AppsInToss 플랫폼에서 동작하는 AI 기반 감정 음악 생성 미니앱입니다.

## 주요 기능

- 🎭 **감정 선택**: 6가지 감정 키워드 (슬픔, 불안, 화남, 우울, 피곤, 차분)
- 🎵 **AI 음악 생성**: Suno API를 활용한 맞춤형 음악 생성
- 🎧 **음악 플레이어**: 생성된 음악 재생 및 공유
- 📚 **내 라이브러리**: 생성한 음악 저장 및 관리
- ✨ **크레딧 시스템**: 일일 5개 무료 크레딧

## 기술 스택

### Frontend
- React 19 + TypeScript
- React Router DOM
- CSS Modules + CSS Variables (TDS 기반 디자인 토큰)
- Vite

### Backend
- Firebase Auth (Anonymous 인증)
- Firebase Functions (Node.js 18)
- Firestore (메타데이터 저장)
- Cloud Storage (음악 파일 저장)
- Suno API (음악 생성)

## 프로젝트 구조

```
moodi/
├── src/
│   ├── components/      # UI 컴포넌트
│   ├── hooks/           # Custom Hooks
│   ├── lib/             # Firebase 설정
│   ├── pages/           # 페이지 컴포넌트
│   ├── styles/          # 글로벌 스타일, 디자인 토큰
│   ├── types/           # TypeScript 타입
│   └── constants/       # 상수 정의
├── functions/           # Firebase Functions
│   └── src/
│       ├── index.ts     # Function 정의
│       ├── types.ts     # 타입
│       └── utils/       # 유틸리티
├── public/              # 정적 파일
├── firebase.json        # Firebase 설정
├── firestore.rules      # Firestore 보안 규칙
└── storage.rules        # Storage 보안 규칙
```

## 시작하기

### 사전 요구사항

- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase 프로젝트 생성 및 설정

### 설치

```bash
# 의존성 설치
npm install

# Functions 의존성 설치
cd functions && npm install && cd ..
```

### 환경 변수 설정

1. `.env` 파일 생성:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Suno API 키 설정 (Firebase Secret Manager):
```bash
firebase functions:secrets:set SUNO_API_KEY
```

### 개발 서버 실행

```bash
# 프론트엔드 개발 서버
npm run dev

# Firebase Emulator (선택)
firebase emulators:start
```

### 빌드 및 배포

```bash
# 프론트엔드 빌드
npm run build

# Functions 배포
firebase deploy --only functions

# 전체 배포
firebase deploy
```

## Firebase 설정

### 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com)에서 프로젝트 생성
2. Authentication > Anonymous 로그인 활성화
3. Firestore Database 생성
4. Storage 활성화
5. Functions 활성화 (Blaze 요금제 필요)

### 2. 보안 규칙 배포
```bash
firebase deploy --only firestore:rules,storage:rules
```

### 3. Functions 배포
```bash
firebase deploy --only functions
```

## 앨범 아트 에셋

감정별 앨범 아트는 `public/assets/album/` 디렉토리에 SVG 파일로 제공됩니다.
실제 배포 시 Firebase Storage의 `album-art/` 경로에 업로드하세요.

## 라이선스

Private - Moodi Team

---

Made with 💜 by Moodi Team
