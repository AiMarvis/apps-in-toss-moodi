# Suno API 오류 수정 + 한국어 가사 품질 향상 + V5 모델 업그레이드

## TL;DR

> **Quick Summary**: Suno API 400 에러를 `customMode: false`로 수정하고, V5 모델 업그레이드와 함께 한국어 가사 품질을 위한 짧은 프롬프트 템플릿으로 전환
> 
> **Deliverables**: 
> - `functions/src/index.ts`: API 페이로드 수정 (V5, customMode: false)
> - `functions/src/utils/generators.ts`: 짧은 한국어 프롬프트 템플릿 추가
> 
> **Estimated Effort**: Quick
> **Parallel Execution**: NO - 순차 실행 (generators.ts → index.ts 의존성)
> **Critical Path**: Task 1 → Task 2

---

## Context

### Original Request
곡 생성 중 400 에러 해결 + 한국어 가사 품질 향상 + V5 모델로 업그레이드

### Interview Summary
**Key Discussions**:
- Root Cause: `customMode: true`일 때 `style`, `title` 파라미터 필수인데 누락 → 400 에러
- 한국어 품질: 현재 프롬프트 ~1000자가 "가사"로 인식되어 품질 저하
- 해결책: `customMode: false` (자동 가사 생성) + 500자 이내 짧은 프롬프트

**Research Findings**:
- Oracle: `customMode: false`로 변경하면 `style`, `title` 불필요
- Metis: 현재 한국어 프롬프트가 ~1000자 → 새로운 짧은 템플릿 필수
- V5는 V4.5와 비용 동일, 품질 향상

### Metis Review
**Identified Gaps** (addressed):
- "프롬프트 500자 초과": 새로운 `EMOTION_PROMPTS_SHORT` 상수 + `buildShortKoreanPrompt()` 함수 추가
- "재시도 로직 누락": lines 118-138도 동일하게 수정
- "검증 기준 불충분": 프롬프트 길이 로깅 + Emulator 테스트 추가

---

## Work Objectives

### Core Objective
Suno API 400 에러를 해결하고, V5 모델로 업그레이드하며, 한국어 가사 품질을 향상시킨다.

### Concrete Deliverables
- `functions/src/utils/generators.ts`: 짧은 프롬프트 상수 및 함수 추가
- `functions/src/index.ts`: API 페이로드 수정 (2곳: 메인 호출 + 재시도)

### Definition of Done
- [ ] `cd functions && npm run build` 성공 (exit code 0)
- [ ] `cd functions && npm run lint` 통과 (exit code 0)
- [ ] 프롬프트 길이 ≤ 500자 (로그로 확인)

### Must Have
- V5 모델 사용 (`model: 'V5'`)
- `customMode: false` (자동 가사 생성 모드)
- 500자 이내 짧은 한국어 프롬프트
- 프롬프트 길이 명시적 제한 (`.substring(0, 500)`)

### Must NOT Have (Guardrails)
- ❌ 함수 시그니처 변경 (`generateMusic`, `sunoCallback` 인터페이스 유지)
- ❌ Firestore 스키마 변경 (`tracks` 컬렉션 구조 유지)
- ❌ 기존 상수 삭제 (`KOREAN_VOCAL_STYLES`, `KOREAN_LYRICAL_NARRATIVES` 유지)
- ❌ V5 전용 추가 파라미터 (`personaId`, `vocalGender` 등 추가 금지)
- ❌ 새로운 감정 키워드 추가
- ❌ 에러 핸들링 패턴 변경

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: NO
- **Framework**: N/A
- **QA approach**: 빌드/린트 + Emulator 로그 확인

### Automated Verification

**빌드 및 린트:**
```bash
cd functions && npm run build && echo "BUILD OK"
npm run lint && echo "LINT OK"
```

**프롬프트 길이 검증 (Emulator):**
```bash
# Emulator 시작
firebase emulators:start --only functions

# 테스트 호출 (별도 터미널)
curl -X POST http://localhost:5001/moodi-b8811/us-central1/generateMusic \
  -H "Content-Type: application/json" \
  -d '{"data":{"emotion":"sad","lyricsLanguage":"ko"}}' 2>&1

# 로그에서 확인:
# - "Prompt length: [숫자 ≤ 500]"
# - "Model: V5"
```

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
└── Task 1: generators.ts - 짧은 프롬프트 템플릿 추가

Wave 2 (After Wave 1):
└── Task 2: index.ts - API 페이로드 수정

Sequential (no parallelization possible)
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2 | None |
| 2 | 1 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1 | delegate_task(category="quick", load_skills=[], run_in_background=false) |
| 2 | 2 | delegate_task(category="quick", load_skills=[], run_in_background=false) |

---

## TODOs

- [ ] 1. generators.ts: 짧은 한국어 프롬프트 템플릿 추가

  **What to do**:
  1. `EMOTION_PROMPTS_SHORT` 상수 추가 (각 감정별 50-80자 프롬프트)
     ```typescript
     const EMOTION_PROMPTS_SHORT: Record<EmotionKeyword, string> = {
       sad: '한국어 발라드, 슬픈 피아노, 감성 보컬, 느린 템포, 이별 주제',
       anxious: '한국어 힐링곡, 부드러운 신스, 안정감 있는 목소리, 평화로운 분위기',
       angry: '한국어 록, 강렬한 기타, 파워풀한 보컬, 빠른 템포, 분노 표현',
       depressed: '한국어 감성곡, 어쿠스틱 기타, 우울한 멜로디, 중간 템포',
       tired: '한국어 어쿠스틱, 부드러운 목소리, 따뜻한 느낌, 휴식 분위기',
       calm: '한국어 재즈, 차분한 피아노, 편안한 보컬, 느긋한 템포',
     };
     ```
  2. `buildShortKoreanPrompt()` 함수 추가
     - 짧은 프롬프트 생성
     - 사용자 텍스트 80자 제한 + 따옴표 이스케이프
     - 최종 프롬프트 500자 제한 (`.substring(0, 500)`)
  3. `buildMusicPrompt()` 함수에서 한국어 보컬일 때 `buildShortKoreanPrompt()` 호출하도록 수정

  **Must NOT do**:
  - ❌ `KOREAN_VOCAL_STYLES`, `KOREAN_LYRICAL_NARRATIVES` 삭제 금지
  - ❌ `buildMusicPrompt()` 함수 시그니처 변경 금지
  - ❌ 영어 프롬프트 로직 변경 금지

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 단일 파일, 상수 추가 및 함수 리팩토링
  - **Skills**: `[]`
    - 특별한 스킬 불필요, 기본 TypeScript 수정

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `functions/src/utils/generators.ts:10-50` - 기존 `EMOTION_PROMPTS` 상수 패턴 참고
  - `functions/src/utils/generators.ts:319-377` - 현재 `buildMusicPrompt()` 함수 구조

  **Type References**:
  - `functions/src/types.ts:EmotionKeyword` - 감정 키워드 타입 정의

  **WHY Each Reference Matters**:
  - `EMOTION_PROMPTS` 패턴을 따라 `EMOTION_PROMPTS_SHORT` 정의해야 일관성 유지
  - `EmotionKeyword` 타입을 사용해야 Record 타입이 올바르게 동작

  **Acceptance Criteria**:

  **빌드 검증 (Bash)**:
  ```bash
  cd /Users/innerbuilder/Projects/moodi-local/functions && npm run build
  # Assert: Exit code 0
  # Assert: Output contains "Successfully compiled"
  ```

  **코드 검증 (Grep)**:
  - `grep -n "EMOTION_PROMPTS_SHORT" functions/src/utils/generators.ts`
    - Assert: 상수 정의 존재
  - `grep -n "buildShortKoreanPrompt" functions/src/utils/generators.ts`
    - Assert: 함수 정의 + export 존재
  - `grep -n "substring(0, 500)" functions/src/utils/generators.ts`
    - Assert: 500자 제한 로직 존재

  **Commit**: YES
  - Message: `fix(functions): add short Korean prompt template for Suno V5`
  - Files: `functions/src/utils/generators.ts`
  - Pre-commit: `cd functions && npm run build`

---

- [ ] 2. index.ts: API 페이로드 수정 (V5 + customMode: false)

  **What to do**:
  1. **메인 API 호출** (lines 93-109) 수정:
     - `model: 'V4_5ALL'` → `model: 'V5'`
     - `customMode: !instrumental` → `customMode: false`
  2. **재시도 로직** (lines 118-138) 동일하게 수정:
     - `model: 'V4_5ALL'` → `model: 'V5'`
     - `customMode: !instrumental` → `customMode: false`
  3. 프롬프트 길이 로깅 추가:
     ```typescript
     functions.logger.info('Prompt length:', prompt.length);
     functions.logger.info('Model: V5');
     ```

  **Must NOT do**:
  - ❌ 함수 시그니처 변경 금지
  - ❌ 에러 핸들링 로직 변경 금지 (artist name 재시도 로직 유지)
  - ❌ V5 전용 추가 파라미터 (`personaId`, `vocalGender`) 추가 금지
  - ❌ callBackUrl 변경 금지

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 단일 파일, 2곳의 문자열/boolean 값 변경 + 로깅 추가
  - **Skills**: `[]`
    - 특별한 스킬 불필요

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1 (generators.ts의 새 함수 필요)

  **References**:

  **Pattern References**:
  - `functions/src/index.ts:91-109` - 메인 API 호출 위치
  - `functions/src/index.ts:118-135` - 재시도 API 호출 위치

  **API References**:
  - Suno API V5 문서: `model: 'V5'`, `customMode: false`로 자동 가사 생성

  **WHY Each Reference Matters**:
  - 두 API 호출 위치를 **모두** 동일하게 수정해야 함 (하나만 수정하면 재시도 시 에러 재발)
  - `customMode: false`로 변경하면 `style`, `title` 파라미터 불필요

  **Acceptance Criteria**:

  **빌드 검증 (Bash)**:
  ```bash
  cd /Users/innerbuilder/Projects/moodi-local/functions && npm run build
  # Assert: Exit code 0
  ```

  **린트 검증 (Bash)**:
  ```bash
  cd /Users/innerbuilder/Projects/moodi-local/functions && npm run lint
  # Assert: Exit code 0
  ```

  **코드 검증 (Grep)**:
  - `grep -c "model: 'V5'" functions/src/index.ts`
    - Assert: Output is "2" (두 곳 모두 V5)
  - `grep -c "customMode: false" functions/src/index.ts`
    - Assert: Output is "2" (두 곳 모두 false)
  - `grep -c "V4_5ALL" functions/src/index.ts`
    - Assert: Output is "0" (V4_5ALL 완전 제거)
  - `grep -c "customMode: !instrumental" functions/src/index.ts`
    - Assert: Output is "0" (기존 로직 제거)

  **Evidence to Capture:**
  - [ ] `npm run build` 출력 (성공)
  - [ ] `npm run lint` 출력 (성공)
  - [ ] grep 결과로 V5, customMode: false 확인

  **Commit**: YES
  - Message: `fix(functions): upgrade to Suno V5 with customMode false`
  - Files: `functions/src/index.ts`
  - Pre-commit: `cd functions && npm run build && npm run lint`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `fix(functions): add short Korean prompt template for Suno V5` | generators.ts | npm run build |
| 2 | `fix(functions): upgrade to Suno V5 with customMode false` | index.ts | npm run build && npm run lint |

---

## Success Criteria

### Verification Commands
```bash
cd /Users/innerbuilder/Projects/moodi-local/functions

# 빌드
npm run build
# Expected: exit 0, "Successfully compiled"

# 린트
npm run lint
# Expected: exit 0, no errors

# V5 모델 확인
grep -c "model: 'V5'" src/index.ts
# Expected: 2

# customMode: false 확인
grep -c "customMode: false" src/index.ts
# Expected: 2

# 구 버전 제거 확인
grep -c "V4_5ALL" src/index.ts
# Expected: 0

# 500자 제한 확인
grep -n "substring(0, 500)" src/utils/generators.ts
# Expected: line number 출력 (존재 확인)
```

### Final Checklist
- [ ] V5 모델 사용 (2곳 모두)
- [ ] customMode: false (2곳 모두)
- [ ] V4_5ALL 완전 제거
- [ ] 짧은 프롬프트 템플릿 추가
- [ ] 500자 제한 적용
- [ ] 빌드 성공
- [ ] 린트 통과
- [ ] 기존 상수 유지 (KOREAN_VOCAL_STYLES 등)
