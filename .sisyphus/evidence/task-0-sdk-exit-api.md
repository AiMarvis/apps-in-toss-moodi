# SDK 앱 종료 API 조사 결과

**조사 일시**: 2026-01-29  
**SDK 버전**: @apps-in-toss/web-framework ^1.5.3  
**조사 범위**: SDK 문서 전체 검색

---

## 1. 조사 결과 요약

### ✅ 발견된 API
**`closeView`** - 현재 화면을 닫는 함수

### ❌ 미발견 API
- `exitApp` - 없음
- `closeApp` - 없음
- `finishApp` - 없음
- `appExit` - 없음

---

## 2. 발견된 API 상세 정보

### `closeView`

#### 함수 시그니처
```typescript
function closeView(): Promise<void>;
```

#### 설명
`closeView`는 현재 화면을 닫는 함수입니다. 예를 들어, "닫기" 버튼을 눌러서 서비스를 종료할 때 사용할 수 있습니다.

#### 파라미터
- 없음

#### 반환값
- `Promise<void>` - 비동기 작업 완료를 나타내는 Promise

#### 사용 예제

**React Native 예제:**
```tsx
import { Button } from 'react-native';
import { closeView } from '@granite-js/react-native';

function CloseButton() {
  return <Button title="닫기" onPress={closeView} />;
}
```

**React (Web) 예제:**
```tsx
import { closeView } from '@apps-in-toss/web-framework';
import { Button } from '@toss/tds-mobile';

function CloseButton() {
  return (
    <Button onClick={closeView}>
      닫기
    </Button>
  );
}
```

#### 제약사항
- 비동기 함수이므로 `await` 또는 `.then()`으로 처리 필요
- 현재 화면을 닫으므로, 최초 랜딩 화면에서 호출 시 앱이 종료됨

---

## 3. 코드베이스 현황

### 현재 사용 현황
- `closeView` 미사용
- `exitApp`, `closeApp`, `finishApp` 미사용
- 백버튼 처리 로직 미구현

### 검색 결과
```bash
grep -r "closeView\|exitApp\|closeApp\|finishApp" src/
# 결과: 매칭 없음
```

---

## 4. 대안 및 권장사항

### 옵션 1: `closeView` 사용 (권장)
- **장점**: SDK 공식 API, 토스 플랫폼과 통합
- **구현**: 백버튼 핸들러에서 `closeView()` 호출
- **제약**: 최초 화면에서만 앱 종료 가능

### 옵션 2: React Router 뒤로가기
- **장점**: 웹 표준 API
- **구현**: `useNavigate()` 또는 `window.history.back()`
- **제약**: 토스 앱 네이티브 백버튼과 동기화 필요

### 옵션 3: 플랫폼 기본 동작
- **장점**: 추가 구현 불필요
- **제약**: 토스 앱의 기본 백버튼 동작에 의존

---

## 5. 검수 이슈 해결 방안

**이슈**: "최초 랜딩 화면에서 백버튼 시 앱 종료되지 않음"

**해결책**:
1. 최초 랜딩 화면(예: 감정 선택 페이지)에서 백버튼 감지
2. `closeView()` 호출하여 앱 종료
3. 다른 페이지에서는 `useNavigate(-1)` 또는 `history.back()` 사용

**구현 예시**:
```tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { closeView } from '@apps-in-toss/web-framework';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = async () => {
      // 최초 화면이므로 앱 종료
      await closeView();
    };

    // 백버튼 이벤트 리스너 등록
    // (토스 플랫폼 백버튼 감지 방식 확인 필요)
    
    return () => {
      // 리스너 제거
    };
  }, []);

  return (
    // 페이지 컨텐츠
  );
}
```

---

## 6. 추가 조사 필요 사항

- [ ] 토스 앱에서 백버튼 이벤트 감지 방식 확인
- [ ] `closeView()` 호출 시 정확한 동작 확인 (앱 종료 vs 미니앱 종료)
- [ ] 다른 페이지에서의 뒤로가기 처리 방식 결정
- [ ] 토스 플랫폼 백버튼 이벤트 리스너 등록 방법 확인

---

## 7. 참고 자료

- SDK 문서: @apps-in-toss/web-framework v1.5.3
- 검색 쿼리: `exitApp`, `closeApp`, `finishApp`, `back`, `history`, `navigation`
- 검색 결과: 총 5개 함수/타입 발견 (closeView, useOverlayBase, ContactsViralParams, ContactsViralSuccessEvent, RewardFromContactsViralEvent)
