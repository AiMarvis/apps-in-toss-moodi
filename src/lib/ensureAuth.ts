import { appLogin } from '@apps-in-toss/web-framework';
import { auth, signInWithCustomToken, loginWithTossFn } from './firebase';
import type { User } from './firebase';

/**
 * Firebase 기능 호출 전 인증을 보장하는 유틸 함수
 * - 이미 로그인되어 있으면 현재 유저 반환
 * - 미로그인 시 토스 로그인 시도
 * @throws 로그인 실패 시 에러 throw
 */
export async function ensureAuth(): Promise<User> {
  // 이미 로그인되어 있으면 바로 반환
  if (auth.currentUser) {
    return auth.currentUser;
  }

  // 토스 로그인 시도
  try {
    // 1. 토스 앱에서 인가 코드 획득
    const { authorizationCode, referrer } = await appLogin();

    // 2. Firebase Functions로 토스 로그인 처리 → Custom Token 받기
    const result = await loginWithTossFn({ authorizationCode, referrer });
    const { customToken } = result.data;

    // 3. Firebase Custom Token으로 로그인
    const userCredential = await signInWithCustomToken(auth, customToken);
    return userCredential.user;
  } catch (err) {
    console.error('토스 로그인 실패:', err);
    throw new Error('로그인에 실패했어요. 다시 시도해주세요.');
  }
}

/**
 * 인증 상태 확인 (로그인 시도 없이)
 */
export function isAuthenticated(): boolean {
  return auth.currentUser !== null;
}

/**
 * 현재 로그인된 유저 반환 (없으면 null)
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * 토스 로그인 수행 (앱 시작 시 자동 호출)
 * - 앱인토스 표준: 앱 시작 시 자동으로 appLogin() 호출
 * - 처음 사용자: 약관 동의 화면 자동 표시 → 동의 후 인가 코드 반환
 * - 기존 사용자: 별도 화면 없이 바로 인가 코드 반환
 * @returns 로그인된 User 또는 실패 시 null
 */
export async function signInWithToss(): Promise<User | null> {
  console.log('[signInWithToss] 시작');
  try {
    // 이미 로그인되어 있으면 현재 유저 반환
    if (auth.currentUser) {
      console.log('[signInWithToss] 이미 로그인됨:', auth.currentUser.uid);
      return auth.currentUser;
    }

    // 1. 토스 앱에서 인가 코드 획득
    // - 처음 사용자: 약관 동의 화면 표시 → 동의 후 인가 코드 반환
    // - 기존 사용자: 별도 화면 없이 바로 인가 코드 반환
    console.log('[signInWithToss] appLogin() 호출...');
    const { authorizationCode, referrer } = await appLogin();
    console.log('[signInWithToss] appLogin() 성공, referrer:', referrer);

    // 2. Firebase Functions로 토스 로그인 처리 → Custom Token 받기
    console.log('[signInWithToss] loginWithTossFn() 호출...');
    const result = await loginWithTossFn({ authorizationCode, referrer });
    const { customToken } = result.data;
    console.log('[signInWithToss] customToken 발급 완료');

    // 3. Firebase Custom Token으로 로그인
    console.log('[signInWithToss] signInWithCustomToken() 호출...');
    const userCredential = await signInWithCustomToken(auth, customToken);
    console.log('[signInWithToss] Firebase 로그인 성공:', userCredential.user.uid);
    return userCredential.user;
  } catch (err: any) {
    console.error('[signInWithToss] 에러:', err);
    return null;
  }
}
