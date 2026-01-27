# 감정 선택 확장 및 캘린더 연동

## Context

### Original Request
> @src/pages/HomePage.tsx 에서 느끼는 감정 선택폭을 더 넓히면 좋겠어 추가로 @src/pages/HomePage.tsx 에서 작성된 내용이 @src/pages/CalendarPage.tsx 에 현재 적용이 안되고 있는데 연동되어서 적용되면 좋겠어

### Interview Summary
**Key Discussions**:
1. **감정 확장**: 6개 → 18개 (긍정 3개, 중립 6개, 부정 9개)
2. **카테고리 UI**: 긍정/중립/부정 탭 필터 + 그리드
3. **캘린더 연동**: 음악 생성 완료 시 자동 일기 저장
4. **일기 전용 페이지**: 음악 없이 일기만 쓰는 DiaryWritePage 신설
5. **기존 감정 유지**: 6개 기존 감정은 위치 유지 (calm→중립, 나머지→부정)

**Research Findings**:
- `useDiary().addDiary()` 함수 존재하지만 미사용 상태 - 연동 핵심 포인트
- 타입/상수/CSS/백엔드 4곳 동기화 필요
- CalendarPage에서 HomePage로 `diaryDate` state 전달하는 코드 존재 (미사용)

### Self-Review Gap Analysis
**Addressed Gaps**:
- 새 감정별 색상/그라데이션 값 필요 → 기존 패턴 기반 자동 생성
- 앨범아트 12개 필요 → placeholder SVG 사용 (scope 제한)
- 백엔드 프롬프트 12개 필요 → 기존 패턴 기반 작성

---

## Work Objectives

### Core Objective
HomePage 감정 선택을 6개에서 18개로 확장하고 카테고리 탭 UI를 추가하며, 음악 생성 완료 시 자동으로 캘린더에 일기가 저장되도록 연동한다.

### Concrete Deliverables
1. 18개 감정 선택 UI (HomePage)
2. 카테고리 탭 필터 (긍정/중립/부정)
3. 음악 생성 → 캘린더 자동 연동
4. DiaryWritePage (음악 없이 일기만)
5. 12개 신규 감정 앨범아트 placeholder

### Definition of Done
- [ ] `npm run dev` 실행 후 HomePage에서 18개 감정이 3개 탭으로 표시됨
- [ ] 감정 선택 + 음악 생성 완료 후 CalendarPage에서 해당 날짜에 일기 표시됨
- [ ] CalendarPage에서 "일기 쓰기" 클릭 시 DiaryWritePage로 이동, 일기 저장 가능
- [ ] `npm run lint` 통과
- [ ] Firebase Functions 배포 (`firebase deploy --only functions`) 성공

### Must Have
- 18개 감정 (기존 6개 + 신규 12개)
- 카테고리 탭 UI
- 음악 생성 완료 시 자동 일기 저장
- DiaryWritePage 신설

### Must NOT Have (Guardrails)
- 기존 6개 감정 삭제/수정 금지 (ID, 색상, 이모지 유지)
- 새 감정 앨범아트 실제 디자인 (placeholder만)
- 일기 수정 기능 (신규 스코프)
- 감정 통계/분석 기능 (신규 스코프)
- 테스트 코드 작성 (테스트 인프라 없음)

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: NO (Manual QA)
- **Framework**: N/A

### Manual QA Only

각 TODO는 상세한 수동 검증 절차를 포함합니다.

---

## Task Flow

```
Phase 1: Type & Constant Expansion
├── TODO 1: EmotionKeyword 타입 확장 (frontend)
├── TODO 2: EmotionKeyword 타입 확장 (backend)
├── TODO 3: EMOTIONS 상수 확장 + 카테고리 필드
├── TODO 4: CSS 토큰 추가
└── TODO 5: Placeholder 앨범아트 생성

Phase 2: Backend Prompt Expansion (depends on Phase 1)
└── TODO 6: generators.ts 프롬프트 확장

Phase 3: HomePage UI (depends on Phase 1)
├── TODO 7: 카테고리 탭 컴포넌트 생성
└── TODO 8: HomePage 감정 그리드 + 탭 UI

Phase 4: Calendar Integration (depends on Phase 1)
├── TODO 9: PlayerPage 자동 일기 저장
├── TODO 10: DiaryWritePage 생성
└── TODO 11: CalendarPage 네비게이션 수정

Phase 5: Final Verification
└── TODO 12: 통합 검증 및 빌드
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 1, 2 | Frontend/Backend 타입은 독립적으로 수정 가능 |
| B | 3, 4, 5 | 상수, CSS, 에셋은 독립적 |
| C | 7, 8 | UI 컴포넌트는 독립적으로 개발 가능 |
| D | 9, 10 | 캘린더 연동과 DiaryWritePage는 독립적 |

| Task | Depends On | Reason |
|------|------------|--------|
| 6 | 1, 2 | 백엔드 프롬프트는 타입 확장 후 진행 |
| 7, 8 | 3 | UI는 EMOTIONS 상수 확장 후 진행 |
| 9, 10, 11 | 1 | 캘린더 연동은 타입 확장 후 진행 |
| 12 | ALL | 통합 검증은 모든 작업 완료 후 |

---

## TODOs

### Phase 1: Type & Constant Expansion

- [ ] 1. EmotionKeyword 타입 확장 (Frontend)

  **What to do**:
  - `src/types/emotion.ts`의 `EmotionKeyword` 타입에 12개 신규 감정 추가
  - 추가할 감정: `happy`, `excited`, `grateful`, `nostalgic`, `bittersweet`, `cozy`, `hopeful`, `empty`, `lonely`, `stressed`, `frustrated`, `disappointed`

  **Must NOT do**:
  - 기존 6개 감정 (`sad`, `anxious`, `angry`, `depressed`, `tired`, `calm`) 삭제/수정

  **Parallelizable**: YES (with 2)

  **References**:
  - `src/types/emotion.ts:2` - 현재 EmotionKeyword 정의 (union type 패턴)

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] `npm run lint` 실행 → 에러 없음
  - [ ] TypeScript 컴파일 확인: `npx tsc --noEmit` → 에러 없음

  **Commit**: NO (groups with 2, 3, 4, 5)

---

- [ ] 2. EmotionKeyword 타입 확장 (Backend)

  **What to do**:
  - `functions/src/types.ts`의 `EmotionKeyword` 타입에 동일한 12개 감정 추가
  - Frontend와 정확히 동일한 값 유지

  **Must NOT do**:
  - 기존 6개 감정 삭제/수정

  **Parallelizable**: YES (with 1)

  **References**:
  - `functions/src/types.ts:4` - 백엔드 EmotionKeyword 정의

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] Functions 빌드 확인: `cd functions && npm run build` → 성공

  **Commit**: NO (groups with 1, 3, 4, 5)

---

- [ ] 3. EMOTIONS 상수 확장 + 카테고리 필드

  **What to do**:
  - `src/types/emotion.ts`에 `EmotionCategory` 타입 추가: `'positive' | 'neutral' | 'negative'`
  - `EmotionInfo` 인터페이스에 `category: EmotionCategory` 필드 추가
  - `src/constants/emotions.ts`의 `EMOTIONS` 배열에 12개 신규 감정 추가
  - 기존 6개 감정에 카테고리 할당: `calm` → `neutral`, 나머지 5개 → `negative`
  - 신규 12개 감정별 색상/그라데이션 정의

  **신규 감정 메타데이터**:
  ```typescript
  // 긍정 (positive)
  { id: 'happy', label: '행복', emoji: '😊', color: '#FBBF24', category: 'positive' }
  { id: 'excited', label: '설렘', emoji: '🤩', color: '#F472B6', category: 'positive' }
  { id: 'grateful', label: '감사', emoji: '🙏', color: '#34D399', category: 'positive' }
  
  // 중립 (neutral) - 기존 calm 포함
  { id: 'nostalgic', label: '그리움', emoji: '🥹', color: '#818CF8', category: 'neutral' }
  { id: 'bittersweet', label: '아련', emoji: '💧', color: '#A78BFA', category: 'neutral' }
  { id: 'cozy', label: '포근', emoji: '☕', color: '#FB923C', category: 'neutral' }
  { id: 'hopeful', label: '희망', emoji: '🌟', color: '#FACC15', category: 'neutral' }
  { id: 'empty', label: '허무', emoji: '🕳️', color: '#94A3B8', category: 'neutral' }
  
  // 부정 (negative) - 기존 5개 포함
  { id: 'lonely', label: '외로움', emoji: '😞', color: '#64748B', category: 'negative' }
  { id: 'stressed', label: '스트레스', emoji: '😖', color: '#F87171', category: 'negative' }
  { id: 'frustrated', label: '답답함', emoji: '😤', color: '#FB7185', category: 'negative' }
  { id: 'disappointed', label: '실망', emoji: '😕', color: '#A1A1AA', category: 'negative' }
  ```

  **Must NOT do**:
  - 기존 6개 감정의 id, label, emoji, color 변경

  **Parallelizable**: YES (with 4, 5)

  **References**:
  - `src/types/emotion.ts:30-37` - EmotionInfo 인터페이스 정의
  - `src/constants/emotions.ts:4-11` - 기존 EMOTIONS 배열 구조
  - `src/constants/emotions.ts:19-26` - ALBUM_ART_MAP 패턴

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] `npm run lint` 실행 → 에러 없음
  - [ ] TypeScript 컴파일: `npx tsc --noEmit` → 성공
  - [ ] EMOTIONS.length === 18 확인 (개발자 도구 콘솔)

  **Commit**: NO (groups with 1, 2, 4, 5)

---

- [ ] 4. CSS 토큰 추가

  **What to do**:
  - `src/styles/tokens.css`에 12개 신규 감정 색상 토큰 추가
  - 변수명 패턴: `--color-emotion-{id}`

  **추가할 CSS 변수**:
  ```css
  --color-emotion-happy: #FBBF24;
  --color-emotion-excited: #F472B6;
  --color-emotion-grateful: #34D399;
  --color-emotion-nostalgic: #818CF8;
  --color-emotion-bittersweet: #A78BFA;
  --color-emotion-cozy: #FB923C;
  --color-emotion-hopeful: #FACC15;
  --color-emotion-empty: #94A3B8;
  --color-emotion-lonely: #64748B;
  --color-emotion-stressed: #F87171;
  --color-emotion-frustrated: #FB7185;
  --color-emotion-disappointed: #A1A1AA;
  ```

  **Must NOT do**:
  - 기존 6개 감정 CSS 변수 수정

  **Parallelizable**: YES (with 3, 5)

  **References**:
  - `src/styles/tokens.css:28-34` - 기존 emotion 색상 토큰 패턴

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] CSS 파일 구문 오류 없음 확인: `npm run dev` 실행 → 콘솔 에러 없음

  **Commit**: NO (groups with 1, 2, 3, 5)

---

- [ ] 5. Placeholder 앨범아트 생성

  **What to do**:
  - `public/assets/album/` 디렉토리에 12개 신규 앨범아트 SVG 생성
  - 파일명 패턴: `album_{emotion_id}.svg`
  - 간단한 placeholder (원형 + 이모지 텍스트)
  - `src/constants/emotions.ts`의 `ALBUM_ART_MAP`에 12개 항목 추가
  - `functions/src/utils/generators.ts`의 `ALBUM_ART_MAP`에 12개 항목 추가

  **생성할 파일**:
  - `album_happy.svg`, `album_excited.svg`, `album_grateful.svg`
  - `album_nostalgic.svg`, `album_bittersweet.svg`, `album_cozy.svg`
  - `album_hopeful.svg`, `album_empty.svg`
  - `album_lonely.svg`, `album_stressed.svg`, `album_frustrated.svg`, `album_disappointed.svg`

  **Must NOT do**:
  - 실제 디자인 작업 (placeholder만)
  - 기존 6개 앨범아트 수정

  **Parallelizable**: YES (with 3, 4)

  **References**:
  - `public/assets/album/album_sad.svg` - 기존 앨범아트 구조 참고
  - `src/constants/emotions.ts:19-26` - 프론트엔드 ALBUM_ART_MAP
  - `functions/src/utils/generators.ts:131-139` - 백엔드 ALBUM_ART_MAP

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] 12개 SVG 파일 존재 확인: `ls public/assets/album/*.svg | wc -l` → 18 (기존 6 + 신규 12)
  - [ ] 브라우저에서 SVG 렌더링 확인: `http://localhost:5173/assets/album/album_happy.svg`

  **Commit**: YES
  - Message: `feat(emotions): add 12 new emotions type/constants/css/assets`
  - Files: `src/types/emotion.ts`, `functions/src/types.ts`, `src/constants/emotions.ts`, `src/styles/tokens.css`, `public/assets/album/*.svg`
  - Pre-commit: `npm run lint`

---

### Phase 2: Backend Prompt Expansion

- [ ] 6. generators.ts 프롬프트 확장

  **What to do**:
  - `functions/src/utils/generators.ts`의 모든 Record 객체에 12개 신규 감정 항목 추가:
    - `EMOTION_PROMPTS` (기본 영어 프롬프트)
    - `EMOTION_LYRICS_HINTS_EN` (영어 가사 힌트)
    - `KOREAN_VOCAL_STYLES` (한국어 보컬 스타일)
    - `KOREAN_LYRICAL_NARRATIVES` (한국어 가사 내러티브)
    - `EMOTION_PROMPTS_ENHANCED` (향상된 한국어 프롬프트)
    - `EMOTION_TITLES` (감정별 제목 3개씩)
    - `EMOTION_DESCRIPTIONS` (감정별 설명)

  **Must NOT do**:
  - 기존 6개 감정 프롬프트 수정

  **Parallelizable**: NO (depends on 1, 2)

  **References**:
  - `functions/src/utils/generators.ts:4-11` - EMOTION_PROMPTS 구조
  - `functions/src/utils/generators.ts:38-57` - KOREAN_VOCAL_STYLES 구조
  - `functions/src/utils/generators.ts:60-86` - KOREAN_LYRICAL_NARRATIVES 구조
  - `functions/src/utils/generators.ts:111-118` - EMOTION_TITLES 구조

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] Functions 빌드: `cd functions && npm run build` → 성공
  - [ ] 타입 검사: 모든 Record<EmotionKeyword, ...>에서 누락된 키 없음

  **Commit**: YES
  - Message: `feat(functions): add music prompts for 12 new emotions`
  - Files: `functions/src/utils/generators.ts`
  - Pre-commit: `cd functions && npm run build`

---

### Phase 3: HomePage UI

- [ ] 7. 카테고리 탭 컴포넌트 생성

  **What to do**:
  - `src/components/common/EmotionCategoryTabs.tsx` 생성
  - `src/components/common/EmotionCategoryTabs.css` 생성
  - Props: `selectedCategory`, `onCategoryChange`, `disabled`
  - 3개 탭: 긍정, 중립, 부정
  - 선택된 탭 시각적 피드백

  **Must NOT do**:
  - 기존 EmotionChip 컴포넌트 수정
  - 복잡한 애니메이션 추가

  **Parallelizable**: YES (with 8)

  **References**:
  - `src/pages/HomePage.tsx:12-19` - MUSIC_TYPES 탭 구조 참고
  - `src/components/common/EmotionChip.tsx` - 컴포넌트 패턴 참고
  - `src/styles/tokens.css` - 디자인 토큰 사용

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] 컴포넌트 렌더링: HomePage에서 3개 탭 표시됨
  - [ ] 탭 클릭 시 선택 상태 변경됨
  - [ ] 접근성: 탭에 aria-selected 속성 적용됨

  **Commit**: NO (groups with 8)

---

- [ ] 8. HomePage 감정 그리드 + 탭 UI

  **What to do**:
  - `src/pages/HomePage.tsx` 수정:
    - `EmotionCategoryTabs` import 및 사용
    - `selectedCategory` state 추가 (기본값: 'negative' - 기존 감정 표시)
    - EMOTIONS 필터링: 선택된 카테고리만 표시
    - 감정 그리드 UI 유지 (EmotionChip 재사용)
  - `src/pages/HomePage.css` 수정:
    - 카테고리 탭 섹션 스타일 추가

  **Must NOT do**:
  - 기존 음악 스타일/가사 선택 UI 수정
  - 감정 선택 로직 변경 (단일 선택 유지)

  **Parallelizable**: YES (with 7)

  **References**:
  - `src/pages/HomePage.tsx:74-88` - 기존 감정 그리드 구조
  - `src/pages/HomePage.tsx:31` - selectedEmotion state 패턴
  - `src/constants/emotions.ts` - EMOTIONS 배열

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] Using dev server:
    - Navigate to: `http://localhost:5173/`
    - Verify: 3개 카테고리 탭 (긍정/중립/부정) 표시됨
    - Action: "긍정" 탭 클릭
    - Verify: 행복, 설렘, 감사 3개 감정만 표시됨
    - Action: "중립" 탭 클릭
    - Verify: 차분, 그리움, 아련, 포근, 희망, 허무 6개 감정 표시됨
    - Action: "부정" 탭 클릭
    - Verify: 슬픔, 불안, 화남, 우울, 피곤, 외로움, 스트레스, 답답함, 실망 9개 감정 표시됨
    - Action: 감정 선택 → 음악 생성 버튼 클릭
    - Verify: LoadingPage로 이동, 선택한 감정 정보 전달됨

  **Commit**: YES
  - Message: `feat(home): add emotion category tabs with 18 emotions`
  - Files: `src/components/common/EmotionCategoryTabs.tsx`, `src/components/common/EmotionCategoryTabs.css`, `src/pages/HomePage.tsx`, `src/pages/HomePage.css`
  - Pre-commit: `npm run lint`

---

### Phase 4: Calendar Integration

- [ ] 9. PlayerPage 자동 일기 저장

  **What to do**:
  - `src/pages/PlayerPage.tsx` 수정:
    - LocationState에 `emotion`, `emotionText` 필드 추가
    - `useDiary` hook import 및 사용
    - 컴포넌트 마운트 시 자동으로 `addDiary` 호출
    - 중복 저장 방지를 위한 ref 사용
  - `src/pages/LoadingPage.tsx` 수정:
    - PlayerPage로 navigate 시 emotion, emotionText state 전달

  **Must NOT do**:
  - 기존 PlayerPage UI/기능 변경
  - 사용자 확인 없이 에러 발생 시 크래시

  **Parallelizable**: YES (with 10)

  **References**:
  - `src/pages/LoadingPage.tsx:56-62` - navigate to PlayerPage 코드
  - `src/pages/PlayerPage.tsx:17-26` - 현재 LocationState 및 track 처리
  - `src/hooks/useDiary.ts:118-153` - addDiary 함수 시그니처
  - `src/types/diary.ts:42-47` - CreateDiaryRequest 타입

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] Using dev server with Firestore:
    - Navigate to: `http://localhost:5173/`
    - Action: 감정 선택 → emotionText 입력 → 음악 생성
    - Wait: 음악 생성 완료 (PlayerPage 이동)
    - Verify: Firestore `diaries` 컬렉션에 새 문서 생성됨
    - Navigate to: CalendarPage
    - Verify: 오늘 날짜에 감정 dot 표시됨
    - Action: 오늘 날짜 클릭
    - Verify: 방금 생성한 일기 카드 표시됨

  **Commit**: NO (groups with 10, 11)

---

- [ ] 10. DiaryWritePage 생성

  **What to do**:
  - `src/pages/DiaryWritePage.tsx` 생성
  - `src/pages/DiaryWritePage.css` 생성
  - UI 구성:
    - 날짜 표시 (location.state.date 또는 오늘)
    - 감정 선택 (카테고리 탭 + 그리드)
    - 텍스트 입력
    - 저장 버튼
  - `useDiary().addDiary` 호출하여 저장
  - 저장 완료 후 CalendarPage로 navigate
  - `src/App.tsx`에 라우트 추가: `/diary/write`

  **Must NOT do**:
  - 음악 생성 기능 추가
  - 복잡한 에디터 기능

  **Parallelizable**: YES (with 9)

  **References**:
  - `src/pages/HomePage.tsx` - 감정 선택 UI 패턴 참고
  - `src/pages/CalendarPage.tsx:52-55` - navigate with date state 패턴
  - `src/hooks/useDiary.ts` - addDiary 사용법
  - `src/App.tsx` - 라우트 정의 패턴

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] Using dev server:
    - Navigate to: `http://localhost:5173/diary/write`
    - Verify: 오늘 날짜, 감정 선택 UI, 텍스트 입력, 저장 버튼 표시됨
    - Action: 감정 선택 → 텍스트 입력 → 저장 클릭
    - Verify: CalendarPage로 이동, 오늘 날짜에 일기 표시됨

  **Commit**: NO (groups with 9, 11)

---

- [ ] 11. CalendarPage 네비게이션 수정

  **What to do**:
  - `src/pages/CalendarPage.tsx` 수정:
    - `handleNewDiary` 함수: navigate 대상을 `/diary/write`로 변경
    - date state 전달 유지

  **Must NOT do**:
  - CalendarPage 다른 기능 수정
  - CalendarView 컴포넌트 수정

  **Parallelizable**: NO (depends on 10)

  **References**:
  - `src/pages/CalendarPage.tsx:52-55` - 기존 handleNewDiary 함수

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] Using dev server:
    - Navigate to: CalendarPage
    - Action: 날짜 선택 → "일기 쓰기" 또는 "오늘의 감정 기록하기" 버튼 클릭
    - Verify: DiaryWritePage로 이동, 선택한 날짜 표시됨

  **Commit**: YES
  - Message: `feat(calendar): auto-save diary on music generation + DiaryWritePage`
  - Files: `src/pages/PlayerPage.tsx`, `src/pages/LoadingPage.tsx`, `src/pages/DiaryWritePage.tsx`, `src/pages/DiaryWritePage.css`, `src/pages/CalendarPage.tsx`, `src/App.tsx`
  - Pre-commit: `npm run lint`

---

### Phase 5: Final Verification

- [ ] 12. 통합 검증 및 빌드

  **What to do**:
  - 전체 lint 검사
  - Functions 빌드
  - 전체 시나리오 테스트

  **Parallelizable**: NO (depends on ALL)

  **References**:
  - All modified files

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] Lint: `npm run lint` → 에러 없음
  - [ ] Functions build: `cd functions && npm run build` → 성공
  - [ ] Full scenario test:
    1. HomePage → 18개 감정 확인 (3개 탭)
    2. 긍정 감정 선택 → 음악 생성 → PlayerPage
    3. CalendarPage → 오늘 일기 확인
    4. CalendarPage → 다른 날짜 "일기 쓰기" → DiaryWritePage → 저장
    5. CalendarPage → 해당 날짜 일기 확인

  **Commit**: NO (only if fixes needed)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 5 | `feat(emotions): add 12 new emotions type/constants/css/assets` | src/types/*.ts, functions/src/types.ts, src/constants/*.ts, src/styles/*.css, public/assets/album/*.svg | `npm run lint` |
| 6 | `feat(functions): add music prompts for 12 new emotions` | functions/src/utils/generators.ts | `cd functions && npm run build` |
| 8 | `feat(home): add emotion category tabs with 18 emotions` | src/components/common/EmotionCategoryTabs.*, src/pages/HomePage.* | `npm run lint` |
| 11 | `feat(calendar): auto-save diary on music generation + DiaryWritePage` | src/pages/*.tsx, src/App.tsx | `npm run lint` |

---

## Success Criteria

### Verification Commands
```bash
npm run lint  # Expected: 0 errors
cd functions && npm run build  # Expected: success
npm run dev  # Expected: app runs without console errors
```

### Final Checklist
- [ ] All "Must Have" present (18 emotions, tabs, auto-save, DiaryWritePage)
- [ ] All "Must NOT Have" absent (no breaking changes to existing features)
- [ ] All lint checks pass
- [ ] Functions build succeeds
- [ ] Full user flow works end-to-end
