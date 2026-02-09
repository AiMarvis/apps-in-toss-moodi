# 토스 앱 반려 사유 수정

## TL;DR

> **Quick Summary**: 토스 앱 출시 반려된 2가지 문제 수정 - Android 공유 모달 텍스트 누락 및 연동 해제 시 로그아웃 미처리
> 
> **Deliverables**:
> - AlertDialog에 title/description/alertButton props 추가
> - 연동 해제 시 localStorage 온보딩 플래그 삭제
> 
> **Estimated Effort**: Quick (2개 파일, 약 10줄 수정)
> **Parallel Execution**: NO - sequential (2 commits)
> **Critical Path**: Task 1 → Task 2 → 테스트

---

## Context

### Original Request
```
Android 모델명: Galaxy S22 Ultra, 버전: 16
1. 노래 공유하기시 모달에 안내 텍스트가 비어있습니다.

기타
1. 토스 앱에서 연동 해제 후 미니앱 재접속 시 로그아웃 처리되지 않습니다. 
   연동 해제 시 로그아웃 처리 및 재로그인(약관 동의) 플로우가 진행될 수 있도록 수정 바랍니다.
```

### Interview Summary
**Key Discussions**:
- 공유 모달: `PlayerPage.tsx`의 AlertDialog에 필수 props 누락
- 연동 해제: signOut 시 `moodi_seen_intro` localStorage 플래그 삭제 안함

**Research Findings**:
- `src/pages/PlayerPage.tsx` 91-94줄: AlertDialog에 title/description/alertButton 없음
- `src/stores/authStore.ts`: 자동 로그아웃 시 localStorage 정리 안함 (line 39, 57)
- `@toss/tds-mobile` AlertDialog 필수 props: title, description, alertButton

### Metis Review
**Identified Gaps** (addressed):
- SplashPage 수정 불필요 확인: localStorage만 정리하면 기존 로직이 정상 동작
- logout() 함수 수정 불필요: Toss 연동 해제 경로만 수정 (일반 로그아웃과 분리)
- alertButton prop 추가 필요: 접근성 및 UX를 위해 필수

---

## Work Objectives

### Core Objective
토스 앱 스토어 반려 사유 2가지를 수정하여 앱 출시 승인 획득

### Concrete Deliverables
- `src/pages/PlayerPage.tsx`: AlertDialog에 title, description, alertButton props 추가
- `src/stores/authStore.ts`: 연동 해제 감지 시 localStorage 플래그 삭제

### Definition of Done
- [ ] Android 기기에서 공유 모달에 안내 텍스트 정상 표시
- [ ] 토스 연동 해제 후 앱 재진입 시 /intro 페이지로 이동
- [ ] 토스 샌드박스 환경에서 두 시나리오 모두 테스트 통과

### Must Have
- AlertDialog에 한국어 안내 메시지 표시
- 연동 해제 시 `moodi_seen_intro` localStorage 삭제
- 기존 일반 logout() 동작 유지 (변경 없음)

### Must NOT Have (Guardrails)
- SplashPage.tsx 수정 금지 - 현재 로직 유지
- IntroductionPage.tsx 수정 금지 - 정상 동작 중
- 백엔드 tossUnlinkCallback 수정 금지 - 정상 동작 중
- authStore.ts의 logout() 함수 수정 금지 - Toss 연동 해제 경로만 수정
- 새로운 컴포넌트 추가 금지 - 기존 코드만 수정
- 테스트 코드 추가 금지 - 버그 수정 범위로 제한

---

## Verification Strategy (MANDATORY)

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> 모든 검증은 에이전트가 직접 실행. 사용자 조작 불필요.

### Test Decision
- **Infrastructure exists**: NO (테스트 프레임워크 미설정)
- **Automated tests**: NO (버그 수정 범위 제한)
- **Agent-Executed QA**: ALWAYS (모든 태스크에 필수)

### Agent-Executed QA Scenarios (MANDATORY)

**Verification Tool by Deliverable Type:**

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| **Frontend/UI** | Playwright (playwright skill) | Navigate, interact, assert DOM, screenshot |
| **Code Verification** | Read + Grep | 코드 변경 확인 |

---

## Execution Strategy

### Sequential Execution (2 Commits)

```
Task 1: AlertDialog props 추가
    ↓
Task 2: localStorage 정리 로직 추가
    ↓
Verification: 통합 테스트
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | None | None |
| 2 | None | None | None |

### Agent Dispatch Summary

| Task | Recommended Agent |
|------|-------------------|
| 1 | delegate_task(category="quick", load_skills=[], ...) |
| 2 | delegate_task(category="quick", load_skills=[], ...) |

---

## TODOs

- [x] 1. AlertDialog에 title, description, alertButton props 추가

  **What to do**:
  - `src/pages/PlayerPage.tsx` 91-94줄의 AlertDialog 수정
  - title: "링크가 복사되었어요"
  - description: "친구들에게 음악을 공유해보세요!"
  - alertButton: 확인 버튼 텍스트

  **Must NOT do**:
  - AlertDialog를 별도 컴포넌트로 분리하지 않음
  - 새로운 state나 로직 추가하지 않음

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 단일 파일, 3줄 이내 수정
  - **Skills**: `[]`
    - Reason: 특별한 스킬 불필요

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (Commit 1)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  
  **Pattern References**:
  - `src/pages/PlayerPage.tsx:91-94` - 현재 AlertDialog 사용 위치
  
  **API/Type References**:
  - `@toss/tds-mobile` AlertDialog - title, description, alertButton props 필요

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: AlertDialog props 코드 확인
    Tool: Read + Grep
    Preconditions: 코드 수정 완료
    Steps:
      1. Read src/pages/PlayerPage.tsx
      2. Grep for "AlertDialog" in the file
      3. Assert: AlertDialog에 title prop 존재
      4. Assert: AlertDialog에 description prop 존재
      5. Assert: AlertDialog에 alertButton prop 존재
    Expected Result: 3개 props 모두 존재
    Evidence: 코드 출력

  Scenario: 빌드 성공 확인
    Tool: Bash
    Preconditions: 코드 수정 완료
    Steps:
      1. Run: npm run build
      2. Assert: exit code 0
      3. Assert: no TypeScript errors
    Expected Result: 빌드 성공
    Evidence: 빌드 로그
  ```

  **Commit**: YES
  - Message: `fix(player): AlertDialog에 title/description/alertButton props 추가`
  - Files: `src/pages/PlayerPage.tsx`
  - Pre-commit: `npm run build`

---

- [x] 2. 연동 해제 시 localStorage 온보딩 플래그 삭제

  **What to do**:
  - `src/stores/authStore.ts` line 39 (visibility change handler) 수정
    - `auth.signOut()` 다음에 `localStorage.removeItem('moodi_seen_intro')` 추가
  - `src/stores/authStore.ts` line 57 (onAuthStateChanged handler) 수정
    - `auth.signOut()` 다음에 `localStorage.removeItem('moodi_seen_intro')` 추가

  **Must NOT do**:
  - logout() 함수 (line 97-104) 수정 금지
  - SplashPage.tsx 수정 금지
  - 새로운 유틸리티 함수 추가 금지

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 단일 파일, 2줄 추가
  - **Skills**: `[]`
    - Reason: 특별한 스킬 불필요

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (Commit 2)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/stores/authStore.ts:36-41` - visibility change 핸들러 (isLinked === false 분기)
  - `src/stores/authStore.ts:54-60` - onAuthStateChanged 핸들러 (isLinked === false 분기)
  - `src/pages/IntroductionPage.tsx:12` - localStorage key 이름: `'moodi_seen_intro'`

  **API/Type References**:
  - `getIsTossLoginIntegratedService()` from `@apps-in-toss/web-framework` - 연동 상태 확인 API
  - `localStorage.removeItem(key)` - Web Storage API

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: localStorage.removeItem 코드 확인 - visibility handler
    Tool: Read + Grep
    Preconditions: 코드 수정 완료
    Steps:
      1. Read src/stores/authStore.ts lines 35-45
      2. Assert: line 39 근처에 auth.signOut() 존재
      3. Assert: signOut 다음에 localStorage.removeItem('moodi_seen_intro') 존재
    Expected Result: removeItem 호출 확인
    Evidence: 코드 출력

  Scenario: localStorage.removeItem 코드 확인 - onAuthStateChanged handler
    Tool: Read + Grep
    Preconditions: 코드 수정 완료
    Steps:
      1. Read src/stores/authStore.ts lines 52-62
      2. Assert: line 57 근처에 auth.signOut() 존재
      3. Assert: signOut 다음에 localStorage.removeItem('moodi_seen_intro') 존재
    Expected Result: removeItem 호출 확인
    Evidence: 코드 출력

  Scenario: logout() 함수 미수정 확인
    Tool: Read
    Preconditions: 코드 수정 완료
    Steps:
      1. Read src/stores/authStore.ts lines 97-104
      2. Assert: logout 함수에 localStorage.removeItem 없음
    Expected Result: logout 함수 변경 없음
    Evidence: 코드 출력

  Scenario: 빌드 성공 확인
    Tool: Bash
    Preconditions: 코드 수정 완료
    Steps:
      1. Run: npm run build
      2. Assert: exit code 0
    Expected Result: 빌드 성공
    Evidence: 빌드 로그
  ```

  **Commit**: YES
  - Message: `fix(auth): 토스 연동 해제 시 온보딩 플래그 삭제하여 재동의 플로우 정상화`
  - Files: `src/stores/authStore.ts`
  - Pre-commit: `npm run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `fix(player): AlertDialog에 title/description/alertButton props 추가` | PlayerPage.tsx | npm run build |
| 2 | `fix(auth): 토스 연동 해제 시 온보딩 플래그 삭제하여 재동의 플로우 정상화` | authStore.ts | npm run build |

---

## Success Criteria

### Verification Commands
```bash
# 빌드 검증
npm run build  # Expected: exit code 0, no errors

# 코드 검증 - AlertDialog props
grep -A5 "AlertDialog" src/pages/PlayerPage.tsx  # Expected: title, description, alertButton 존재

# 코드 검증 - localStorage 정리
grep "removeItem.*moodi_seen_intro" src/stores/authStore.ts  # Expected: 2개 매칭
```

### Final Checklist
- [x] AlertDialog에 title, description, alertButton props 존재
- [x] authStore.ts에 localStorage.removeItem 2곳 추가
- [x] logout() 함수 변경 없음
- [x] SplashPage.tsx 변경 없음
- [x] npm run build 성공
