import { appLogin } from '@apps-in-toss/web-framework';
import { auth, signInWithCustomToken, loginWithTossFn } from './firebase';
import { logger } from '../utils/logger';
import type { User } from './firebase';

export async function ensureAuth(): Promise<User> {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  try {
    const { authorizationCode, referrer } = await appLogin();
    const result = await loginWithTossFn({ authorizationCode, referrer });
    const { customToken } = result.data;
    const userCredential = await signInWithCustomToken(auth, customToken);
    return userCredential.user;
  } catch (err) {
    logger.error('Auth', '토스 로그인 실패', err);
    throw new Error('로그인에 실패했어요. 다시 시도해주세요.');
  }
}

export function isAuthenticated(): boolean {
  return auth.currentUser !== null;
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export async function signInWithToss(): Promise<User | null> {
  logger.debug('Auth', '토스 로그인 시작');
  
  try {
    if (auth.currentUser) {
      logger.debug('Auth', '이미 로그인됨', auth.currentUser.uid);
      return auth.currentUser;
    }

    logger.debug('Auth', 'appLogin() 호출');
    const { authorizationCode, referrer } = await appLogin();
    logger.debug('Auth', 'appLogin() 성공', referrer);

    logger.debug('Auth', 'loginWithTossFn() 호출');
    const result = await loginWithTossFn({ authorizationCode, referrer });
    const { customToken } = result.data;
    logger.debug('Auth', 'customToken 발급 완료');

    logger.debug('Auth', 'signInWithCustomToken() 호출');
    const userCredential = await signInWithCustomToken(auth, customToken);
    logger.debug('Auth', 'Firebase 로그인 성공', userCredential.user.uid);
    
    return userCredential.user;
  } catch (err) {
    logger.error('Auth', '로그인 에러', err);
    return null;
  }
}
