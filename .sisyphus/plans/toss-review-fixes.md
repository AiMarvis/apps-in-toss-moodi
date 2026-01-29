# 토스 검수 피드백 5가지 이슈 수정

## TL;DR

> **Quick Summary**: 토스 미니앱 검수에서 지적된 5가지 이슈(백버튼 앱 종료, UI 오정렬, CTA 미동작, 연동 해제 로그아웃, 약관 동의)를 test 브랜치에서 수정하고 샌드박스 앱에서 검증합니다.
> 
> **Deliverables**:
> - 이슈 1: 홈 화면 백버튼 시 앱 종료 처리
> - 이슈 2: TabBar, CTA 버튼, 하이라이트 이펙트 레이아웃 수정
> - 이슈 3: "나만의 음악 만들기" CTA 버튼 클릭 이벤트 수정
> - 이슈 4: 토스 연동 해제 감지 및 자동 로그아웃 처리
> - 이슈 5: 토스 로그인 시 약관 동의 흐름 확인
> 
> **Estimated Effort**: Medium (5개 이슈, 각각 독립적 수정)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: 이슈 1 (SDK 확인) → 이슈 4 (연동 상태 확인) → 최종 검증

---

## Context

### Original Request
토스 미니앱 검수 피드백 5가지 이슈를 test 브랜치에서 수정하고 검증:
1. 최초 랜딩 화면 백버튼 → 앱 종료
2. UI 레이아웃 오정렬 (탭바, CTA, 하이라이트)
3. "나만의 음악 만들기" CTA 미동작
4. 연동 해제 후 로그아웃 미처리
5. 토스 로그인 시 약관 동의 없음

### Interview Summary
**Key Discussions**:
- 검증 방식: 샌드박스 앱 수동 검증 선택됨
- test 브랜치에서 작업 진행 확인됨

**Research Findings**:
- `appLogin()` 사용 중 - 토스 콘솔 설정 시 약관 자동 표시됨
- `exitApp`/`closeApp` 함수 미사용 - SDK API 확인 필요
- `getIsTossLoginIntegratedService()` API 발견 - 연동 상태 확인 가능
- TabBar는 커스텀 구현 (TDS NavigationBar 미사용)
- `.home-footer` CSS에 `pointer-events: none` 적용됨

### Metis Review
**Identified Gaps** (addressed):
- 이슈 1: SDK 앱 종료 API 확인 필요 → 조건부 구현으로 해결
- 이슈 3: TDS Button에 pointer-events 미적용 → CSS 수정으로 해결
- 이슈 4: `getIsTossLoginIntegratedService()` API 사용 권장
- 이슈 5: 콘솔 설정 문제일 수 있음 → 코드 확인 후 콘솔 점검 권장

---

## Work Objectives

### Core Objective
토스 검수 피드백 5가지 이슈를 수정하여 재검수 요청이 가능한 상태로 만듦

### Concrete Deliverables
- `src/pages/HomePage.tsx` - 백버튼 처리 로직 추가
- `src/pages/HomePage.css` - CTA 버튼 pointer-events 수정
- `src/components/common/TabBar.css` - 레이아웃 정렬 수정
- `src/stores/authStore.ts` - 연동 상태 확인 및 자동 로그아웃
- `src/lib/ensureAuth.ts` - 약관 동의 흐름 확인

### Definition of Done
- [x] 모든 5가지 이슈 수정 완료
- [ ] 샌드박스 앱에서 각 이슈별 수동 검증 통과
- [x] test 브랜치에 커밋 완료

### Must Have
- 홈 화면에서 백버튼 시 앱 종료 (SDK API 존재 시)
- CTA 버튼 클릭 시 정상 동작
- 연동 해제 후 재접속 시 로그아웃 상태
- 로그인 시 약관 동의 화면 표시 (콘솔 설정 정상 시)

### Must NOT Have (Guardrails)
- TabBar 또는 Footer 전체 레이아웃 구조 변경
- 5개 이슈 외 다른 버그 수정 (발견 시 별도 기록만)
- SDK에 존재하지 않는 API 사용 시도
- `appLogin()` 외 다른 인증 흐름 구현
- 커스텀 약관 동의 UI 구현

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (테스트 프레임워크 미설정)
- **User wants tests**: Manual-only (샌드박스 앱 수동 검증)
- **Framework**: None

### Automated Verification Only (NO User Intervention)

**By Deliverable Type:**

| Type | Verification Tool | Automated Procedure |
|------|------------------|---------------------|
| **Frontend/UI** | Playwright browser via playwright skill | 홈 화면 접근, 버튼 클릭, 스크린샷 캡처 |
| **Build** | npm run build via Bash | 빌드 성공 확인 |

**Evidence Requirements (Agent-Executable):**
- npm run build → 성공 (exit code 0)
- 스크린샷: `.sisyphus/evidence/` 디렉토리에 저장
- 각 이슈별 체크리스트 완료 기록

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 0: SDK 앱 종료 API 조사 [no dependencies]
├── Task 2: CTA 버튼 pointer-events 수정 [no dependencies]
└── Task 3: TabBar 레이아웃 검토 및 수정 [no dependencies]

Wave 2 (After Wave 1):
├── Task 1: 홈 화면 백버튼 처리 [depends: 0]
├── Task 4: 연동 상태 확인 로직 추가 [no dependencies]
└── Task 5: 약관 동의 흐름 확인 [no dependencies]

Wave 3 (After Wave 2):
└── Task 6: 전체 통합 검증 및 빌드 [depends: 1, 2, 3, 4, 5]

Critical Path: Task 0 → Task 1 → Task 6
Parallel Speedup: ~40% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 0 | None | 1 | 2, 3 |
| 1 | 0 | 6 | 4, 5 |
| 2 | None | 6 | 0, 3 |
| 3 | None | 6 | 0, 2 |
| 4 | None | 6 | 1, 5 |
| 5 | None | 6 | 1, 4 |
| 6 | 1, 2, 3, 4, 5 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 0, 2, 3 | delegate_task(category="quick", load_skills=[], run_in_background=true) |
| 2 | 1, 4, 5 | dispatch parallel after Wave 1 completes |
| 3 | 6 | final integration task with playwright skill |

---

## TODOs

- [x] 0. SDK 앱 종료 API 조사

  **What to do**:
  - `@apps-in-toss/web-framework` SDK에서 앱 종료 관련 API 검색
  - `apps-in-toss_search_docs` 도구로 `exitApp`, `closeApp`, `finishApp`, `history`, `back` 등 검색
  - SDK 버전 1.5.3에서 사용 가능한 함수 확인
  - 함수 시그니처 및 사용 예제 문서화

  **Must NOT do**:
  - 코드 수정 없음 - 조사만 진행

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: SDK 문서 검색만 수행하는 간단한 조사 작업
  - **Skills**: []
    - 추가 스킬 불필요 - apps-in-toss MCP 도구 사용

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 1
  - **Blocked By**: None

  **References**:
  - Apps-in-Toss SDK 문서: `apps-in-toss_search_docs` 도구 사용
  - 현재 SDK 버전: `package.json` → `@apps-in-toss/web-framework: ^1.5.3`

  **Acceptance Criteria**:
  - [x] SDK 앱 종료 API 존재 여부 확인
  - [x] 존재 시: 함수명, 파라미터, 반환값 문서화
  - [x] 미존재 시: 대안 방법 (예: history.back() 또는 플랫폼 기본 동작) 문서화
  - 결과를 `.sisyphus/evidence/task-0-sdk-exit-api.md`에 기록

  **Commit**: NO (조사 작업)

---

- [x] 1. 홈 화면 백버튼 앱 종료 처리 (이슈 1)

  **What to do**:
  - Task 0 결과에 따라 구현 방식 결정
  - IF SDK API 존재: `HomePage.tsx`에 백버튼 이벤트 리스너 추가
  - IF SDK API 미존재: 플랫폼 기본 동작에 의존하도록 구현 (history 스택 관리)
  - 홈 화면(`/`)이 history 루트가 되도록 보장
  - `SplashGuard` 로직 확인하여 Splash → Intro → Home 흐름에서 history 정리

  **Must NOT do**:
  - SDK에 존재하지 않는 API 호출
  - 다른 페이지의 백버튼 동작 변경

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Task 0 결과에 따라 조건부 구현, 복잡도 중간
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (Task 0 결과 의존)
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Task 0

  **References**:
  **Pattern References**:
  - `src/App.tsx:30-41` - SplashGuard useEffect 패턴 (navigate with replace)
  - `src/pages/PlayerPage.tsx` - 기존 백버튼 구현 패턴

  **API/Type References**:
  - Task 0 결과 문서: `.sisyphus/evidence/task-0-sdk-exit-api.md`

  **External References**:
  - 비게임 출시 가이드: "진입 시 첫 화면에서는 백버튼 사용하지 않아요"

  **WHY Each Reference Matters**:
  - SplashGuard 패턴은 history 스택 관리 방법 제시
  - PlayerPage는 기존 백버튼 UI/로직 참조용
  - 출시 가이드는 요구사항 명세

  **Acceptance Criteria**:
  - IF SDK API 존재:
    - [x] 홈 화면에서 시스템 백버튼 시 앱 종료 함수 호출
    - [x] 다른 페이지에서는 기존 동작 유지
  - IF SDK API 미존재:
    - [ ] 홈 화면이 history 루트임을 확인
    - [ ] 시스템 백버튼 시 플랫폼 기본 동작 (앱 종료) 발생
  - [x] 빌드 성공: `npm run build` → exit code 0

  **Commit**: YES
  - Message: `fix(navigation): 홈 화면 백버튼 시 앱 종료 처리`
  - Files: `src/pages/HomePage.tsx`, `src/App.tsx` (필요시)
  - Pre-commit: `npm run build`

---

- [x] 2. CTA 버튼 pointer-events 수정 (이슈 3)

  **What to do**:
  - `src/pages/HomePage.css` 수정
  - `.home-footer` 내 Button 요소에 `pointer-events: auto` 확실히 적용
  - 옵션 1: `.home-footer button` 또는 `.home-footer > *` 선택자 추가
  - 옵션 2: 인라인 스타일 또는 className 추가
  - TDS Button이 클릭 이벤트를 받는지 확인

  **Must NOT do**:
  - `.home-footer`의 전체 구조 변경
  - Button 컴포넌트를 다른 컴포넌트로 교체
  - `handleGenerate` 로직 변경

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: CSS 한 줄 수정으로 해결 가능한 단순 작업
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 0, 3)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/pages/HomePage.css:340-353` - `.home-footer` 현재 스타일
  - `src/pages/HomePage.css:355-386` - `.generate-button` 스타일 (현재 미적용)

  **API/Type References**:
  - `src/pages/HomePage.tsx:206-214` - Button 컴포넌트 사용 코드

  **WHY Each Reference Matters**:
  - `.home-footer`는 `pointer-events: none`이 적용된 컨테이너
  - `.generate-button`은 실제 사용되지 않는 클래스명 (TDS Button은 자체 클래스 사용)

  **Acceptance Criteria**:
  **Automated Verification (playwright skill):**
  ```
  # Agent executes via playwright browser automation:
  1. Navigate to: http://localhost:5173/
  2. Wait for: selector ".home-footer button" to be visible
  3. Click: first emotion chip to select emotion
  4. Click: ".home-footer button" (CTA button)
  5. Wait for: URL contains "/loading"
  6. Assert: navigation successful
  7. Screenshot: .sisyphus/evidence/task-2-cta-click.png
  ```
  - [x] 감정 선택 후 CTA 버튼 클릭 시 `/loading` 페이지로 이동
  - [x] 빌드 성공: `npm run build` → exit code 0

  **Commit**: YES
  - Message: `fix(ui): CTA 버튼 pointer-events 수정`
  - Files: `src/pages/HomePage.css`
  - Pre-commit: `npm run build`

---

- [x] 3. TabBar 레이아웃 검토 및 수정 (이슈 2)

  **What to do**:
  - `src/components/common/TabBar.tsx` 및 `TabBar.css` 검토
  - 탭 선택 시 하이라이트 이펙트 (`tab-item.active::after`) 확인
  - 오정렬 원인 분석:
    - 탭 간격 불균형?
    - active 상태 스타일 미적용?
    - z-index 문제?
  - 필요시 CSS 수정

  **Must NOT do**:
  - TabBar 전체 구조 변경
  - TDS NavigationBar로 교체
  - 4개 탭 외 다른 요소 추가

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI 레이아웃 및 스타일링 작업
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: CSS 레이아웃 문제 분석에 필요

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 0, 2)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/components/common/TabBar.tsx:33-50` - TabBar 렌더링 로직
  - `src/components/common/TabBar.css:1-95` - 전체 스타일

  **WHY Each Reference Matters**:
  - TabBar.tsx는 현재 탭 구조와 active 상태 적용 방식
  - TabBar.css는 하이라이트 이펙트 (`.tab-item.active::after`) 정의

  **Acceptance Criteria**:
  **Automated Verification (playwright skill):**
  ```
  # Agent executes via playwright browser automation:
  1. Navigate to: http://localhost:5173/
  2. Screenshot: .sisyphus/evidence/task-3-tabbar-home.png
  3. Click: selector ".tab-item" with label "캘린더"
  4. Wait for: URL contains "/calendar"
  5. Screenshot: .sisyphus/evidence/task-3-tabbar-calendar.png
  6. Assert: active tab has highlight effect visible
  ```
  - [x] 모든 탭 정렬 균등
  - [x] 탭 선택 시 하이라이트 이펙트 표시
  - [x] 빌드 성공: `npm run build` → exit code 0

  **Commit**: YES
  - Message: `fix(ui): TabBar 레이아웃 및 하이라이트 이펙트 수정`
  - Files: `src/components/common/TabBar.css`
  - Pre-commit: `npm run build`

---

- [x] 4. 연동 상태 확인 및 자동 로그아웃 (이슈 4)

  **What to do**:
  - `@apps-in-toss/web-framework`에서 `getIsTossLoginIntegratedService` 함수 import
  - `src/stores/authStore.ts`의 `initialize()` 함수에 연동 상태 확인 로직 추가
  - 토스 사용자(`uid.startsWith('toss_')`)이면서 연동 해제된 경우 자동 로그아웃
  - 로그아웃 시 세션 스토리지 및 상태 초기화

  **Must NOT do**:
  - `authStore` 전체 구조 변경
  - 연동 해제 시 사용자에게 별도 UI 표시 (요구사항 아님)
  - Firebase Auth 외 다른 인증 방식 추가

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: SDK API 호출 추가 및 조건부 로직, 복잡도 중간
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 1, 5)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/stores/authStore.ts:26-39` - `initialize()` 함수 패턴
  - `src/pages/SettingsPage.tsx:31-32` - 토스 사용자 확인 패턴 (`uid.startsWith('toss_')`)

  **API/Type References**:
  - `@apps-in-toss/web-framework` - `getIsTossLoginIntegratedService()` (apps-in-toss_search_docs로 확인)

  **External References**:
  - 토스 로그인 문서: 콜백으로 로그인 끊기 섹션

  **WHY Each Reference Matters**:
  - `initialize()` 패턴은 앱 시작 시 실행되는 로직 위치
  - 토스 사용자 확인 패턴은 조건 적용 방법

  **Acceptance Criteria**:
  ```typescript
  // Expected implementation pattern:
  import { getIsTossLoginIntegratedService } from '@apps-in-toss/web-framework';

  // In initialize() after onAuthStateChanged callback:
  if (firebaseUser && firebaseUser.uid.startsWith('toss_')) {
    const isLinked = await getIsTossLoginIntegratedService();
    if (!isLinked) {
      await auth.signOut();
      set({ user: null, credits: 0 });
      return;
    }
  }
  ```
  - [x] 토스 연동 해제된 상태에서 앱 재접속 시 자동 로그아웃
  - [x] 로그아웃 후 로그인 화면 표시 (재로그인 가능)
  - [x] 빌드 성공: `npm run build` → exit code 0

  **Commit**: YES
  - Message: `fix(auth): 토스 연동 해제 시 자동 로그아웃 처리`
  - Files: `src/stores/authStore.ts`
  - Pre-commit: `npm run build`

---

- [x] 5. 약관 동의 흐름 확인 (이슈 5)

  **What to do**:
  - `src/lib/ensureAuth.ts` 현재 `appLogin()` 호출 방식 확인
  - `appLogin()` 호출 시 약관이 표시되어야 함 (SDK 기본 동작)
  - 콘솔 설정이 올바른지 확인하는 체크리스트 작성
  - 필요시 로깅 추가하여 약관 동의 상태 디버깅

  **Must NOT do**:
  - `appLogin()` 을 다른 함수로 교체
  - 자체 약관 동의 UI 구현
  - 콘솔 설정 변경 (코드 외 작업)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 코드 확인 및 로깅 추가 정도의 간단한 작업
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 1, 4)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/lib/ensureAuth.ts:12` - `appLogin()` 호출 부분
  - `src/lib/ensureAuth.ts:40-42` - `signInWithToss()` 함수의 `appLogin()` 호출

  **External References**:
  - 토스 로그인 문서: "appLogin 함수를 호출하면 토스 로그인 창이 열리고, 앱인토스 콘솔에서 등록한 약관 동의 화면이 노출돼요"

  **WHY Each Reference Matters**:
  - `appLogin()` 호출이 정상적으로 이루어지는지 확인
  - SDK 문서에 따르면 콘솔 설정 시 자동으로 약관 표시됨

  **Acceptance Criteria**:
  - [x] `appLogin()` 호출이 올바르게 이루어지는지 확인
  - [x] 약관 미표시가 코드 문제인지 콘솔 설정 문제인지 분류
  - [x] 콘솔 설정 확인 체크리스트:
    - 콘솔 > 앱 설정 > 토스 로그인 > 약관 등록 확인
    - 등록된 약관이 활성화 상태인지 확인
  - [x] 결과를 `.sisyphus/evidence/task-5-terms-check.md`에 기록

  **Commit**: YES (로깅 추가 시)
  - Message: `fix(auth): 약관 동의 흐름 확인 및 디버그 로깅 추가`
  - Files: `src/lib/ensureAuth.ts`
  - Pre-commit: `npm run build`

---

- [x] 6. 전체 통합 검증 및 빌드

  **What to do**:
  - `npm run build` 실행하여 빌드 성공 확인
  - `npm run lint` 실행하여 코드 스타일 확인
  - 샌드박스 앱에서 5가지 이슈 수동 검증 체크리스트:
    1. 홈 화면 백버튼 → 앱 종료 (또는 플랫폼 기본 동작)
    2. TabBar 탭 선택 시 하이라이트 표시
    3. CTA 버튼 클릭 시 /loading 이동
    4. (토스 앱에서 연동 해제 후) 재접속 시 로그아웃 상태
    5. 새 사용자 로그인 시 약관 동의 화면 표시
  - 모든 증거 파일 확인

  **Must NOT do**:
  - 추가 버그 수정 (발견 시 별도 기록만)
  - 프로덕션 배포

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 전체 통합 검증 및 최종 확인 작업
  - **Skills**: [`playwright`]
    - `playwright`: UI 자동화 테스트 및 스크린샷 캡처

  **Parallelization**:
  - **Can Run In Parallel**: NO (최종 작업)
  - **Parallel Group**: Wave 3 (final)
  - **Blocks**: None
  - **Blocked By**: Tasks 1, 2, 3, 4, 5

  **References**:
  - 모든 이전 Task의 evidence 파일들
  - `.sisyphus/evidence/` 디렉토리 내 모든 파일

  **Acceptance Criteria**:
  **Automated Verification (Bash):**
  ```bash
  # Agent runs:
  npm run build
  # Assert: Exit code 0
  
  npm run lint
  # Assert: No errors (warnings OK)
  ```

  **Automated Verification (playwright skill):**
  ```
  # Agent executes full UI test sequence:
  1. Navigate to: http://localhost:5173/splash
  2. Wait for redirect to /intro or /
  3. Screenshot: .sisyphus/evidence/task-6-home.png
  4. Click emotion chip, click CTA
  5. Assert: /loading page reached
  6. Navigate back to home
  7. Click each tab, verify navigation
  8. Screenshot final state
  ```

  **Evidence to Capture:**
  - [x] Terminal output from npm run build
  - [x] Terminal output from npm run lint
  - [ ] Screenshots for visual verification
  - [x] 수동 검증 체크리스트 결과: `.sisyphus/evidence/task-6-manual-verification.md`

  **Commit**: YES
  - Message: `chore: 토스 검수 피드백 5가지 이슈 수정 완료`
  - Files: 모든 수정된 파일
  - Pre-commit: `npm run build && npm run lint`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `fix(navigation): 홈 화면 백버튼 시 앱 종료 처리` | HomePage.tsx, App.tsx | npm run build |
| 2 | `fix(ui): CTA 버튼 pointer-events 수정` | HomePage.css | npm run build |
| 3 | `fix(ui): TabBar 레이아웃 및 하이라이트 이펙트 수정` | TabBar.css | npm run build |
| 4 | `fix(auth): 토스 연동 해제 시 자동 로그아웃 처리` | authStore.ts | npm run build |
| 5 | `fix(auth): 약관 동의 흐름 확인 및 디버그 로깅 추가` | ensureAuth.ts | npm run build |
| 6 | `chore: 토스 검수 피드백 5가지 이슈 수정 완료` | all | npm run build && npm run lint |

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Expected: 빌드 성공, exit code 0
npm run lint   # Expected: 에러 없음
```

### Final Checklist
- [x] 이슈 1: 홈 화면 백버튼 시 앱 종료 (SDK 지원 시) 또는 플랫폼 기본 동작
- [x] 이슈 2: TabBar 레이아웃 정렬, 탭 선택 시 하이라이트 표시
- [x] 이슈 3: CTA 버튼 클릭 시 정상 동작
- [x] 이슈 4: 연동 해제 후 재접속 시 로그아웃 상태
- [x] 이슈 5: 로그인 시 약관 동의 화면 표시 (콘솔 설정 정상 시)
- [x] 모든 커밋 test 브랜치에 완료
- [x] 빌드 및 lint 통과
