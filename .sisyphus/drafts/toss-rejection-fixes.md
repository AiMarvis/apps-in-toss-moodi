# Draft: 토스 앱 반려 사유 수정

## Requirements (confirmed)
- Android Galaxy S22 Ultra에서 공유 모달 텍스트가 비어있는 문제 수정
- 토스 연동 해제 시 로그아웃 처리 및 재로그인(약관 동의) 플로우 정상 동작

## Technical Decisions
- AlertDialog에 title/description props 추가하여 공유 성공 메시지 표시
- 로그아웃 시 `localStorage.removeItem('moodi_seen_intro')` 호출하여 온보딩 상태 초기화
- SplashPage에서 인증 상태 + intro 플래그 둘 다 확인하여 라우팅 결정

## Research Findings
- `src/pages/PlayerPage.tsx`: AlertDialog에 title/description 없음 (lines 91-94)
- `src/stores/authStore.ts`: signOut 시 localStorage 클리어 안함
- `src/pages/SplashPage.tsx`: 인증 상태 확인 없이 localStorage만 확인
- `getIsTossLoginIntegratedService()`: @apps-in-toss/web-framework의 연동 상태 확인 API

## Scope Boundaries
- INCLUDE: PlayerPage AlertDialog 수정, authStore 로그아웃 로직 수정, SplashPage 인증 확인 추가
- EXCLUDE: 백엔드(Cloud Functions) 수정 없음, tossUnlinkCallback은 현재 정상 동작

## Open Questions
- 없음 (분석 완료)
