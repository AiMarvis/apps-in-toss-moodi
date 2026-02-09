# 토스 앱 반려사유 해결

## TL;DR

> **Quick Summary**: 토스 앱 스토어 반려사유 3가지를 해결합니다: 로딩 진행률 30% 멈춤, 연동 해제 후 로그아웃 미처리, 시스템 alert 대신 TDS 모달 사용.
> 
> **Deliverables**:
> - 프론트엔드 시뮬레이션 진행률 로직 추가 (`useMusicGeneration.ts`)
> - visibility 변화 시 연동 상태 확인 로직 추가 (`authStore.ts`)
> - 시스템 alert를 TDS AlertDialog로 교체 (`PlayerPage.tsx`)
> 
> **Estimated Effort**: Short (3-4시간)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Issue 3 → Issue 2 → Issue 1

---

## Context

### Original Request
토스 앱 스토어 심사에서 반려된 3가지 사유 해결:
1. 나만의 음악 만들기 시 1분간 대기해도 로딩 프로그레스가 30%에서 더 진행되지 않음
2. 토스 앱에서 연동 해제 후 미니앱 재접속 시 로그아웃 처리되지 않음
3. 앱 내 알럿(링크 복사 등)은 시스템 알럿이 아닌 TDS 모달 등으로 수정 필요

### Research Findings

**Issue 1 - Progress stuck at 30%**:
- Root cause: `functions/src/index.ts` line 324에서 PENDING 상태일 때 hardcoded `progress: 30` 반환
- Frontend `useMusicGeneration.ts` line 78에서 백엔드 값 그대로 표시
- Suno API가 GENERATING으로 전환되기 전까지 사용자는 30% 고정 상태를 봄

**Issue 2 - Logout not triggered after disconnect**:
- Root cause: `authStore.ts`의 연동 상태 확인이 `onAuthStateChanged` 내부에서만 발생
- 토스 설정에서 연동 해제해도 Firebase 세션은 유지됨 → auth state change 미발생
- visibility 변화 시 재확인 로직 부재

**Issue 3 - System alert instead of TDS**:
- `PlayerPage.tsx` line 98: `alert('링크가 복사되었어요!')`
- 프로젝트에 `ConfirmModal` 컴포넌트 존재 (`@toss/tds-mobile` ConfirmDialog 사용)
- AlertDialog (단일 버튼) 컴포넌트로 교체 필요

### Metis Review

**Identified Gaps** (addressed):
- 시뮬레이션 진행률 상한선: 60%로 설정 (perceived "almost done" 방지)
- visibility listener cleanup: initialize() 반환값에 포함
- AlertDialog vs Toast 선택: AlertDialog 사용 (모달 방식)

---

## Work Objectives

### Core Objective
토스 앱 스토어 반려사유 3가지를 모두 해결하여 재심사 통과

### Concrete Deliverables
- `src/hooks/useMusicGeneration.ts`: 시뮬레이션 진행률 로직 추가
- `src/stores/authStore.ts`: visibilitychange 리스너 추가
- `src/pages/PlayerPage.tsx`: alert() → AlertDialog 교체

### Definition of Done
- [ ] 30% 진행률에서 멈추지 않고 점진적으로 증가 (최대 60%)
- [ ] 토스 연동 해제 후 앱 재접속 시 자동 로그아웃 및 로그인 화면 표시
- [ ] 링크 복사 시 TDS AlertDialog 표시 (시스템 alert 사용 안 함)

### Must Have
- 백엔드 변경 없이 프론트엔드만 수정
- 기존 기능 동작 유지
- TDS 디자인 가이드라인 준수

### Must NOT Have (Guardrails)
- Backend progress calculation 변경
- Polling interval 변경 (3초 유지)
- Toast/Snackbar 시스템 도입
- 글로벌 Alert 컴포넌트 생성 (이 한 곳에서만 필요)
- 세션 타임아웃 로직 추가
- Heartbeat/keep-alive 메커니즘 추가

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: Manual-only (토스 앱 환경에서 검증)
- **Framework**: none

### Automated Verification (Agent-Executable)

**Code Review Verification** (using Bash grep):
```bash
# Issue 1: 시뮬레이션 로직 존재 확인
grep -n "simulat" src/hooks/useMusicGeneration.ts
# Assert: Returns line numbers containing simulation logic

# Issue 2: visibility listener 존재 확인
grep -n "visibilitychange" src/stores/authStore.ts
# Assert: Returns line numbers containing visibilitychange

# Issue 3: alert() 제거 확인
grep -n "alert(" src/pages/PlayerPage.tsx
# Assert: Returns 0 results (no browser alert)

grep -n "AlertDialog" src/pages/PlayerPage.tsx
# Assert: Returns >0 results (TDS component used)
```

**Build Verification** (using Bash):
```bash
npm run lint
# Assert: Exit code 0 (no lint errors)

npm run build
# Assert: Exit code 0 (build succeeds)
```

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - Independent):
├── Task 1: Issue 3 - TDS AlertDialog 교체 (가장 단순, 독립적)
└── Task 2: Issue 2 - Visibility 리스너 추가 (독립적)

Wave 2 (After Wave 1):
└── Task 3: Issue 1 - 시뮬레이션 진행률 (가장 복잡, 상태 관리)

Wave 3 (Final):
└── Task 4: 통합 검증 및 빌드 확인
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 4 | 2 |
| 2 | None | 4 | 1 |
| 3 | None | 4 | None (높은 집중도 필요) |
| 4 | 1, 2, 3 | None | None (final) |

---

## TODOs

- [ ] 1. TDS AlertDialog로 시스템 alert 교체

  **What to do**:
  - `PlayerPage.tsx`에서 `alert('링크가 복사되었어요!')` 제거
  - `@toss/tds-mobile`에서 `AlertDialog` import
  - AlertDialog 상태 관리 추가 (`isAlertOpen` state)
  - 공유 성공 시 AlertDialog 열기
  - 확인 버튼 클릭 시 AlertDialog 닫기

  **Must NOT do**:
  - 새로운 공유 AlertModal 컴포넌트 생성 금지 (인라인 사용)
  - Toast/Snackbar 사용 금지
  - 다른 페이지 수정 금지

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 단일 파일, 10줄 미만 변경, 명확한 패턴
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: TDS 컴포넌트 스타일링 이해
  - **Skills Evaluated but Omitted**:
    - `playwright`: UI 테스트 불필요, 코드 검증만

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:
  
  **Pattern References**:
  - `src/components/common/ConfirmModal.tsx:26-44` - TDS ConfirmDialog 사용 패턴 (AlertDialog와 유사)

  **API/Type References**:
  - `@toss/tds-mobile` - AlertDialog 컴포넌트 API

  **Code Location**:
  - `src/pages/PlayerPage.tsx:98` - 교체할 alert() 위치

  **Acceptance Criteria**:

  **Code Review Verification** (using Bash):
  ```bash
  # Agent runs:
  grep -c "alert(" src/pages/PlayerPage.tsx
  # Assert: Output is "0" (no browser alert calls)

  grep -c "AlertDialog" src/pages/PlayerPage.tsx
  # Assert: Output is >= 1 (AlertDialog used)

  grep -c "isAlertOpen\|setIsAlertOpen" src/pages/PlayerPage.tsx
  # Assert: Output is >= 2 (state management exists)
  ```

  **Build Verification**:
  ```bash
  npm run lint -- --quiet && echo "LINT_OK"
  # Assert: Output contains "LINT_OK"
  ```

  **Commit**: YES
  - Message: `fix(player): replace system alert with TDS AlertDialog`
  - Files: `src/pages/PlayerPage.tsx`
  - Pre-commit: `npm run lint`

---

- [ ] 2. 연동 해제 후 자동 로그아웃 처리

  **What to do**:
  - `authStore.ts`의 `initialize()` 함수에 `visibilitychange` 이벤트 리스너 추가
  - `document.visibilityState === 'visible'`일 때만 연동 상태 확인
  - Toss 사용자(`uid.startsWith('toss_')`)인 경우에만 확인
  - `getIsTossLoginIntegratedService()` 호출하여 연동 해제 시 `auth.signOut()` 실행
  - cleanup 함수에 `removeEventListener` 포함

  **Must NOT do**:
  - Heartbeat/keep-alive 메커니즘 추가 금지
  - 로그인 플로우 변경 금지
  - 세션 타임아웃 로직 추가 금지
  - debounce/throttle 불필요 (visibility change는 드물게 발생)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 단일 파일, 명확한 패턴, 20줄 미만 추가
  - **Skills**: []
    - 특별한 스킬 불필요 - 순수 JS/TS 작업
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: UI 변경 없음

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/stores/authStore.ts:28-43` - 기존 onAuthStateChanged 내부 연동 상태 확인 패턴 (동일 로직 재사용)
  - `src/stores/authStore.ts:27-55` - initialize() 함수 구조 및 cleanup 반환 패턴

  **API References**:
  - `@apps-in-toss/web-framework` - `getIsTossLoginIntegratedService()` 함수

  **Acceptance Criteria**:

  **Code Review Verification** (using Bash):
  ```bash
  # Agent runs:
  grep -c "visibilitychange" src/stores/authStore.ts
  # Assert: Output is >= 1 (listener added)

  grep -c "removeEventListener" src/stores/authStore.ts
  # Assert: Output is >= 1 (cleanup exists)

  grep -n "getIsTossLoginIntegratedService" src/stores/authStore.ts | wc -l
  # Assert: Output is >= 2 (called in both onAuthStateChanged and visibility handler)
  ```

  **Build Verification**:
  ```bash
  npm run lint -- --quiet && echo "LINT_OK"
  # Assert: Output contains "LINT_OK"
  ```

  **Commit**: YES
  - Message: `fix(auth): check integration status on visibility change for proper logout`
  - Files: `src/stores/authStore.ts`
  - Pre-commit: `npm run lint`

---

- [ ] 3. 시뮬레이션 진행률 로직 추가

  **What to do**:
  - `useMusicGeneration.ts`에 시뮬레이션 진행률 로직 추가
  - 새로운 ref 추가: `simulationRef` (setInterval ID)
  - `checkStatus` 콜백에서 `progress === 30`이면 시뮬레이션 시작
  - 2초마다 2%씩 증가, 최대 60%까지
  - 실제 진행률(50% 이상) 또는 완료/에러 시 시뮬레이션 중단
  - `clearPolling` 및 `reset`에서 시뮬레이션 interval 정리

  **Must NOT do**:
  - Backend progress calculation 변경 금지
  - Polling interval 변경 금지 (3초 유지)
  - 시뮬레이션 진행률 60% 초과 금지
  - exponential backoff 또는 retry 로직 추가 금지

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: 상태 관리 로직이지만 복잡도는 중간 수준
  - **Skills**: []
    - 특별한 스킬 불필요 - React hooks 패턴
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: 로직만 변경, UI 변경 없음

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential)
  - **Blocks**: Task 4
  - **Blocked By**: None (but recommended after 1, 2 for focus)

  **References**:

  **Pattern References**:
  - `src/hooks/useMusicGeneration.ts:28-29` - 기존 ref 패턴 (`pollingRef`, `pollingCountRef`)
  - `src/hooks/useMusicGeneration.ts:33-39` - `clearPolling` 함수 패턴 (시뮬레이션 정리도 여기 추가)
  - `src/hooks/useMusicGeneration.ts:77-78` - 진행률 업데이트 위치 (시뮬레이션 시작점)

  **Logic References**:
  - Line 78: `setProgress(data.progress || 50)` - 시뮬레이션 시작 조건 (`data.progress === 30`)
  - Line 68-72: 완료 처리 - 시뮬레이션 중단 필요
  - Line 73-76: 에러 처리 - 시뮬레이션 중단 필요

  **Acceptance Criteria**:

  **Code Review Verification** (using Bash):
  ```bash
  # Agent runs:
  grep -c "simulat" src/hooks/useMusicGeneration.ts
  # Assert: Output is >= 3 (simulationRef, clearSimulation, startSimulation or similar)

  grep -n "setInterval\|clearInterval" src/hooks/useMusicGeneration.ts
  # Assert: Both setInterval and clearInterval should exist

  grep -c "60" src/hooks/useMusicGeneration.ts
  # Assert: Output >= 1 (MAX_SIMULATED_PROGRESS cap)
  ```

  **Build Verification**:
  ```bash
  npm run lint -- --quiet && echo "LINT_OK"
  # Assert: Output contains "LINT_OK"
  ```

  **Commit**: YES
  - Message: `fix(loading): add simulated progress to prevent stuck at 30%`
  - Files: `src/hooks/useMusicGeneration.ts`
  - Pre-commit: `npm run lint`

---

- [ ] 4. 통합 검증 및 빌드 확인

  **What to do**:
  - 전체 lint 실행 및 통과 확인
  - 전체 빌드 실행 및 통과 확인
  - 모든 변경사항 최종 코드 리뷰

  **Must NOT do**:
  - 새로운 기능 추가 금지
  - 추가 리팩토링 금지

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 검증만 수행, 빠른 확인
  - **Skills**: []
    - 빌드 명령어만 실행

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (final)
  - **Blocks**: None
  - **Blocked By**: Task 1, 2, 3

  **References**:
  - `package.json` - lint, build 스크립트 확인

  **Acceptance Criteria**:

  **Full Verification** (using Bash):
  ```bash
  # Agent runs:
  npm run lint
  # Assert: Exit code 0

  npm run build
  # Assert: Exit code 0

  # Final code review checks
  grep -c "alert(" src/pages/PlayerPage.tsx
  # Assert: Output is "0"

  grep -c "visibilitychange" src/stores/authStore.ts
  # Assert: Output is >= 1

  grep -c "simulat" src/hooks/useMusicGeneration.ts
  # Assert: Output is >= 1
  ```

  **Commit**: NO (changes already committed in tasks 1-3)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `fix(player): replace system alert with TDS AlertDialog` | PlayerPage.tsx | npm run lint |
| 2 | `fix(auth): check integration status on visibility change for proper logout` | authStore.ts | npm run lint |
| 3 | `fix(loading): add simulated progress to prevent stuck at 30%` | useMusicGeneration.ts | npm run lint |
| 4 | (no commit - verification only) | - | npm run build |

---

## Success Criteria

### Verification Commands
```bash
# All three issues resolved
npm run lint   # Expected: no errors
npm run build  # Expected: success

# Code checks
grep -c "alert(" src/pages/PlayerPage.tsx           # Expected: 0
grep -c "AlertDialog" src/pages/PlayerPage.tsx      # Expected: >= 1
grep -c "visibilitychange" src/stores/authStore.ts  # Expected: >= 1
grep -c "simulat" src/hooks/useMusicGeneration.ts   # Expected: >= 1
```

### Final Checklist
- [ ] 시스템 alert() 사용하지 않음 (TDS AlertDialog 사용)
- [ ] visibility 변화 시 연동 상태 확인 로직 존재
- [ ] 시뮬레이션 진행률 로직 존재 (30% → 60% 점진적 증가)
- [ ] 모든 lint 통과
- [ ] 빌드 성공
