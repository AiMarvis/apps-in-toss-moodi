# Learnings - Toss Review Fixes

## 2026-01-29

### SDK APIs Discovered

1. **`closeView()`** - 앱/화면 종료
   - Import: `@apps-in-toss/web-framework`
   - Returns: `Promise<void>`
   - Use case: 최초 랜딩 화면에서 백버튼 처리

2. **`getIsTossLoginIntegratedService()`** - 토스 로그인 연동 상태 확인
   - Import: `@apps-in-toss/web-framework`
   - Returns: `Promise<boolean>`
   - Use case: 연동 해제 감지 및 자동 로그아웃

### CSS Patterns

1. **pointer-events layering**
   - 부모에 `pointer-events: none` 설정 시
   - 클릭 가능한 자식에 반드시 `pointer-events: auto` 추가 필요

2. **@keyframes scope**
   - CSS 애니메이션은 같은 파일 또는 전역 CSS에 정의 필요
   - 다른 파일의 keyframes는 자동으로 import되지 않음

### Back Button Handling

- 토스 앱에서 백버튼은 `popstate` 이벤트로 전달됨
- 최초 화면에서는 `closeView()` 호출로 앱 종료 처리
- 다른 화면에서는 기본 네비게이션 동작 사용

### Auth State Management

- 토스 사용자 식별: `uid.startsWith('toss_')`
- 연동 상태 확인은 `onAuthStateChanged` 콜백 내에서 처리
- 연동 해제 시 Firebase `auth.signOut()` 호출 후 상태 초기화
