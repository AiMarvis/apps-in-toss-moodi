# Moodi Project - Claude Code 가이드

## 프로젝트 개요
Moodi(무디)는 AppsInToss 플랫폼에서 동작하는 AI 기반 감정 음악 생성 미니앱입니다.

## 작업 시작 전 필수 사항

### 1. AGENTS.md 참조
- 작업 전 해당 디렉토리의 `AGENTS.md` 파일을 반드시 읽고 컨텍스트를 파악할 것
- 계층 구조: 루트 → src/ → components/ 등 순으로 참조
- 주요 AGENTS.md 위치:
  - `/AGENTS.md` - 프로젝트 전체 개요
  - `/src/AGENTS.md` - 프론트엔드 구조
  - `/functions/AGENTS.md` - Firebase Functions 백엔드
  - `/src/components/AGENTS.md` - React 컴포넌트 가이드

### 2. oh-my-claudecode 명령어 활용
모든 작업에서 적절한 oh-my-claudecode 명령어를 활용하여 효율적으로 진행:

| 상황 | 명령어 | 설명 |
|------|--------|------|
| 코드 작성 후 | `/oh-my-claudecode:code-review` | 코드 품질 검토 |
| 보안 관련 코드 | `/oh-my-claudecode:security-review` | 보안 취약점 검사 |
| 복잡한 작업 | `/oh-my-claudecode:plan` | 구현 계획 수립 |
| 빌드 오류 | `/oh-my-claudecode:build-fix` | 빌드/타입 오류 수정 |
| 테스트 필요 | `/oh-my-claudecode:tdd` | TDD 워크플로우 |
| 코드베이스 탐색 | `/oh-my-claudecode:deepsearch` | 심층 코드 검색 |
| 분석 필요 | `/oh-my-claudecode:analyze` | 심층 분석 |
| UI 작업 | `/oh-my-claudecode:frontend-ui-ux` | UI/UX 디자인 가이드 |

### 3. moai-platform-appintoss 플러그인 사용
AppsInToss 미니앱 개발 시 항상 moai 플러그인 활용:
- `/moai-platform-appintoss:moai-platform-appintoss` - 앱인토스 전문가 에이전트
- WebView/React Native SDK, 토스 로그인/결제, 푸시 알림, 광고 통합 가이드 제공
- 토스 앱 내 미니앱 개발 관련 질문 시 반드시 사용

## 기술 스택 요약

### Frontend
- React 19 + TypeScript
- React Router DOM 7.x
- Zustand (상태 관리)
- CSS Modules + TDS 디자인 토큰
- Vite + Granite (AppsInToss)

### Backend
- Firebase Auth (토스 로그인 / Anonymous)
- Firebase Functions v1
- Firestore + Cloud Storage
- Suno API (음악 생성)

## 개발 명령어

```bash
npm run dev          # 개발 서버 (Granite)
npm run dev:vite     # 개발 서버 (Vite)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
firebase deploy      # Firebase 배포
```

## 주의사항

### 코드 스타일
- 모든 UI 텍스트는 한국어로 작성
- TDS 디자인 토큰 사용 (CSS 변수)
- 함수형 컴포넌트 + TypeScript 사용
- 에러 메시지는 사용자 친화적 한국어로

### 보안
- API 키는 Firebase Secret Manager에서 관리
- 환경 변수는 `VITE_` 접두사 필수
- mTLS 인증서는 Secret Manager에 저장

### 감정 키워드 (6가지)
`sad`, `anxious`, `angry`, `depressed`, `tired`, `calm`

<!-- MANUAL: 프로젝트별 추가 지침은 아래에 작성 -->
