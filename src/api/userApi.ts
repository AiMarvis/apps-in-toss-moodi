import { getUserInfoFn, loginWithTossFn, grantCreditsFn } from '../lib/firebase';

export interface UserInfo {
  id: string;
  credits: number;
  lastCreditReset: { seconds: number };
  createdAt: { seconds: number };
  trackCount: number;
}

export interface TossLoginParams {
  authorizationCode: string;
  referrer: 'DEFAULT' | 'SANDBOX';
}

export interface TossLoginResult {
  customToken: string;
  userKey: number;
  isNewUser: boolean;
}

export interface GrantCreditsParams {
  orderId: string;
  sku: string;
  credits: number;
}

export interface GrantCreditsResult {
  success: boolean;
  credits?: number;
}

export async function getUserInfo(): Promise<UserInfo> {
  const result = await getUserInfoFn();
  return result.data;
}

export async function loginWithToss(params: TossLoginParams): Promise<TossLoginResult> {
  const result = await loginWithTossFn(params);
  return result.data;
}

export async function grantCredits(params: GrantCreditsParams): Promise<GrantCreditsResult> {
  const result = await grantCreditsFn(params);
  return result.data;
}
