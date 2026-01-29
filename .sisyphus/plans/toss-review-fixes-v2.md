# 토스 검수 피드백 수정 v2 - 미해결 이슈 수정

## TL;DR

> **Quick Summary**: 토스 미니앱 검수 피드백 중 미해결된 2가지 이슈(백버튼 앱 종료, 연동 해제 로그아웃 디버깅)를 수정합니다.
> 
> **Deliverables**:
> - 이슈 #1: `popstate` → `graniteEvent.addEventListener('backEvent')` 변경
> - 이슈 #4: 에러 로깅 추가 + undefined 케이스 명시적 처리
> 
> **Estimated Effort**: Quick (2개 파일, 각각 10줄 이내 수정)
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 → Task 3 (검증)

---

## Context

### Original Request
기존 `.sisyphus/plans/toss-review-fixes.md` 실행 후 샌드박스 테스트 결과, 일부 이슈가 여전히 해결되지 않음:
- 이슈 #1: 백버튼 앱 종료 - `popstate` 이벤트가 history 없으면 발생하지 않음
- 이슈 #4: 연동 해제 로그아웃 - 에러가 조용히 무시되어 디버깅 불가

### Interview Summary
**Key Discussions**:
- 이슈 #2, #3, #5는 이미 해결됨 (추가 수정 불필요)
- undefined 반환 시 정상 진행 (명시적으로 false일 때만 로그아웃)
- 검증: 빌드 성공 + LSP diagnostics

**Research Findings**:
- SDK 문서: `graniteEvent.addEventListener('backEvent', { onEvent, onError })` 공식 API
- SDK 문서: `getIsTossLoginIntegratedService()` 반환값 - true/false/undefined
- 현재 코드: HomePage.tsx 42-49줄에 popstate 리스너 존재
- 현재 코드: authStore.ts 30-41줄에 연동 상태 확인 로직 존재
- 로깅 유틸: `src/utils/logger.ts` 존재 - `logger.error('Tag', 'message', error)` 패턴

### Metis Review
**Identified Gaps** (addressed):
1. **graniteEvent 리스너 cleanup 필요** → useEffect return에서 unsubscription() 호출
2. **undefined 처리 명확화** → `isLinked === false` 조건으로 명시화
3. **로깅 컨벤션 확인** → `logger.error('Auth', ...)` 패턴 사용
4. **SDK 버전 확인** → ^1.5.3 버전에서 graniteEvent 지원됨

---

## Work Objectives

### Core Objective
토스 검수 피드백 중 미해결된 2가지 이슈를 수정하여 재검수 요청이 가능한 상태로 만듦

### Concrete Deliverables
- `src/pages/HomePage.tsx` - backEvent 리스너로 변경
- `src/stores/authStore.ts` - 에러 로깅 + undefined 명시적 처리

### Definition of Done
- [ ] 이슈 #1: graniteEvent.addEventListener('backEvent') 구현
- [ ] 이슈 #4: 에러 로깅 추가 + isLinked === false 조건 명시화
- [ ] npm run build → exit code 0
- [ ] LSP diagnostics → 타입 에러 없음

### Must Have
- graniteEvent 리스너 등록 및 cleanup
- closeView() 호출로 앱 종료
- 에러 로깅 (logger.error 사용)
- undefined 케이스 명시적 처리

### Must NOT Have (Guardrails)
- 이슈 #2, #3, #5 수정 (이미 해결됨)
- ensureAuth.ts 수정 (범위 외)
- 다른 페이지의 백버튼 동작 변경
- 민감한 사용자 정보 로깅 (PII 금지)
- auth.signOut() 외 추가 로그아웃 처리 (localStorage 등)

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: Manual-only (샌드박스 앱 수동 검증)
- **Framework**: None

### Automated Verification Only (NO User Intervention)

| Type | Verification Tool | Automated Procedure |
|------|------------------|---------------------|
| **Build** | npm run build via Bash | 빌드 성공 확인 (exit code 0) |
| **Type Check** | LSP diagnostics | 타입 에러 없음 확인 |

**Evidence Requirements (Agent-Executable):**
- npm run build → 성공 (exit code 0)
- lsp_diagnostics → severity: error 0개

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: 백버튼 graniteEvent 리스너 구현 [no dependencies]
└── Task 2: 연동 상태 확인 에러 로깅 개선 [no dependencies]

Wave 2 (After Wave 1):
└── Task 3: 통합 검증 및 빌드 [depends: 1, 2]

Critical Path: Task 1 → Task 3
Parallel Speedup: ~50% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3 | 2 |
| 2 | None | 3 | 1 |
| 3 | 1, 2 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | delegate_task(category="quick", run_in_background=true) |
| 2 | 3 | final integration task |

---

## TODOs

- [ ] 1. 홈 화면 백버튼 graniteEvent 리스너 구현 (이슈 #1)

  **What to do**:
  - `src/pages/HomePage.tsx`에서 `graniteEvent` import 추가
  - 기존 `popstate` useEffect 제거
  - `graniteEvent.addEventListener('backEvent', ...)` 리스너 추가
  - cleanup에서 `unsubscription()` 호출

  **Must NOT do**:
  - 다른 페이지의 백버튼 동작 변경
  - closeView() 외 다른 종료 방법 사용
  - 확인 다이얼로그 추가 (요구사항 아님)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 단일 파일 10줄 이내 수정, SDK API 사용
  - **Skills**: []
    - 추가 스킬 불필요

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 3
  - **Blocked By**: None

  **References**:
  
  **Pattern References**:
  - `src/pages/HomePage.tsx:42-49` - 현재 popstate 리스너 (제거 대상)
  - `src/pages/HomePage.tsx:4` - 현재 closeView import 위치

  **API/Type References**:
  - SDK: `graniteEvent.addEventListener('backEvent', { onEvent, onError })` → unsubscription 함수 반환
  - SDK: `closeView(): Promise<void>`

  **WHY Each Reference Matters**:
  - 42-49줄은 제거할 코드 위치
  - 4줄은 import 수정 위치

  **Code Change**:
  ```tsx
  // Before (lines 4, 42-49):
  import { closeView } from '@apps-in-toss/web-framework';
  
  useEffect(() => {
    const handlePopState = async () => {
      await closeView();
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // After:
  import { closeView, graniteEvent } from '@apps-in-toss/web-framework';
  
  useEffect(() => {
    const unsubscription = graniteEvent.addEventListener('backEvent', {
      onEvent: async () => {
        await closeView();
      },
      onError: (error) => console.error('[HomePage] backEvent error:', error),
    });

    return () => unsubscription();
  }, []);
  ```

  **Acceptance Criteria**:
  ```bash
  # Agent runs:
  npm run build
  # Assert: Exit code 0
  ```
  ```
  # Agent runs LSP diagnostics:
  lsp_diagnostics(filePath="src/pages/HomePage.tsx", severity="error")
  # Assert: 0 errors
  ```
  - [ ] graniteEvent import 추가됨
  - [ ] popstate 리스너 제거됨
  - [ ] backEvent 리스너 등록됨
  - [ ] cleanup에서 unsubscription() 호출됨
  - [ ] 빌드 성공

  **Commit**: YES
  - Message: `fix(navigation): 홈 화면 백버튼을 graniteEvent로 변경`
  - Files: `src/pages/HomePage.tsx`
  - Pre-commit: `npm run build`

---

- [ ] 2. 연동 상태 확인 에러 로깅 개선 (이슈 #4)

  **What to do**:
  - `src/stores/authStore.ts`에서 logger import 추가
  - catch 블록에 에러 로깅 추가
  - `isLinked === false` 조건 명시화 (undefined 무시)

  **Must NOT do**:
  - 민감한 사용자 정보 로깅 (uid, email 등)
  - undefined일 때 로그아웃 처리
  - auth 플로우 전체 구조 변경
  - ensureAuth.ts 수정

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 단일 파일 5줄 이내 수정
  - **Skills**: []
    - 추가 스킬 불필요

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3
  - **Blocked By**: None

  **References**:
  
  **Pattern References**:
  - `src/stores/authStore.ts:30-41` - 현재 연동 상태 확인 로직
  - `src/utils/logger.ts` - 로깅 유틸리티 (logger.error 패턴)

  **WHY Each Reference Matters**:
  - 30-41줄은 수정할 코드 위치
  - logger.ts는 프로젝트 로깅 컨벤션 참조

  **Code Change**:
  ```typescript
  // Before (lines 30-41):
  if (firebaseUser && firebaseUser.uid.startsWith('toss_')) {
    try {
      const isLinked = await getIsTossLoginIntegratedService();
      if (!isLinked) {
        // 연동 해제된 경우 자동 로그아웃
        await auth.signOut();
        set({ user: null, credits: 0, loading: false, initialized: true });
        return;
      }
    } catch {
      // 연동 상태 확인 실패 시 무시 (정상 진행)
    }
  }

  // After:
  if (firebaseUser && firebaseUser.uid.startsWith('toss_')) {
    try {
      const isLinked = await getIsTossLoginIntegratedService();
      if (isLinked === false) {
        // 연동 해제된 경우 자동 로그아웃 (undefined는 무시)
        await auth.signOut();
        set({ user: null, credits: 0, loading: false, initialized: true });
        return;
      }
    } catch (error) {
      // 연동 상태 확인 실패 시 로깅 후 정상 진행
      console.error('[AuthStore] 연동 상태 확인 실패:', error);
    }
  }
  ```

  **Acceptance Criteria**:
  ```bash
  # Agent runs:
  npm run build
  # Assert: Exit code 0
  ```
  ```
  # Agent runs LSP diagnostics:
  lsp_diagnostics(filePath="src/stores/authStore.ts", severity="error")
  # Assert: 0 errors
  ```
  - [ ] catch 블록에 에러 로깅 추가됨
  - [ ] `!isLinked` → `isLinked === false` 조건 변경됨
  - [ ] 주석 업데이트됨
  - [ ] 빌드 성공

  **Commit**: YES
  - Message: `fix(auth): 연동 상태 확인 에러 로깅 및 undefined 처리 개선`
  - Files: `src/stores/authStore.ts`
  - Pre-commit: `npm run build`

---

- [ ] 3. 통합 검증 및 빌드

  **What to do**:
  - `npm run build` 실행하여 빌드 성공 확인
  - `npm run lint` 실행하여 코드 스타일 확인
  - LSP diagnostics로 타입 에러 확인
  - 변경 사항 커밋

  **Must NOT do**:
  - 추가 버그 수정 (발견 시 별도 기록만)
  - 프로덕션 배포

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 검증 명령어 실행만
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (최종 작업)
  - **Parallel Group**: Wave 2 (final)
  - **Blocks**: None
  - **Blocked By**: Tasks 1, 2

  **References**:
  - Task 1, 2의 수정 파일들

  **Acceptance Criteria**:
  ```bash
  # Agent runs:
  npm run build
  # Assert: Exit code 0
  
  npm run lint
  # Assert: No errors (warnings OK)
  ```
  - [ ] 빌드 성공
  - [ ] lint 에러 없음
  - [ ] 모든 변경 사항 커밋됨

  **Commit**: YES
  - Message: `chore: 토스 검수 피드백 v2 수정 완료`
  - Files: 모든 수정된 파일
  - Pre-commit: `npm run build && npm run lint`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `fix(navigation): 홈 화면 백버튼을 graniteEvent로 변경` | HomePage.tsx | npm run build |
| 2 | `fix(auth): 연동 상태 확인 에러 로깅 및 undefined 처리 개선` | authStore.ts | npm run build |
| 3 | `chore: 토스 검수 피드백 v2 수정 완료` | all | npm run build && npm run lint |

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Expected: 빌드 성공, exit code 0
npm run lint   # Expected: 에러 없음
```

### Final Checklist
- [ ] 이슈 #1: graniteEvent.addEventListener('backEvent') 구현됨
- [ ] 이슈 #4: 에러 로깅 추가 + isLinked === false 조건 명시화됨
- [ ] 빌드 및 lint 통과
- [ ] 커밋 완료

### 샌드박스 수동 검증 (코드 작업 후)
> 아래 항목은 토스 샌드박스 앱에서 수동으로 검증해야 함

- [ ] 홈 화면에서 시스템 백버튼 → 앱 종료
- [ ] 토스 앱에서 연동 해제 후 미니앱 재접속 → 자동 로그아웃
- [ ] 콘솔 로그에서 에러 로깅 확인 (연동 해제 시)
