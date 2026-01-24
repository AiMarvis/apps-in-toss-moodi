type ErrorCode = 'CREDIT_INSUFFICIENT' | 'AUTH_REQUIRED' | 'NETWORK' | 'UNKNOWN';

interface ParsedError {
  code: ErrorCode;
  message: string;
  originalError: unknown;
}

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  CREDIT_INSUFFICIENT: '크레딧이 부족해요. 내일 다시 시도해주세요!',
  AUTH_REQUIRED: '로그인이 필요해요. 다시 시도해주세요.',
  NETWORK: '네트워크 연결을 확인해주세요.',
  UNKNOWN: '문제가 발생했어요. 다시 시도해주세요.',
};

function getErrorCode(error: unknown): ErrorCode {
  if (!error || typeof error !== 'object') return 'UNKNOWN';

  const message = 'message' in error ? String((error as { message: string }).message) : '';
  const code = 'code' in error ? String((error as { code: string }).code) : '';

  if (message.includes('크레딧') || code.includes('resource-exhausted')) {
    return 'CREDIT_INSUFFICIENT';
  }
  if (message.includes('로그인') || code.includes('unauthenticated')) {
    return 'AUTH_REQUIRED';
  }
  if (message.includes('network') || message.includes('Network') || code.includes('unavailable')) {
    return 'NETWORK';
  }

  return 'UNKNOWN';
}

export function parseError(error: unknown): ParsedError {
  const code = getErrorCode(error);
  return {
    code,
    message: ERROR_MESSAGES[code],
    originalError: error,
  };
}

export function getErrorMessage(error: unknown): string {
  return parseError(error).message;
}

export function isAuthError(error: unknown): boolean {
  return parseError(error).code === 'AUTH_REQUIRED';
}

export function isCreditError(error: unknown): boolean {
  return parseError(error).code === 'CREDIT_INSUFFICIENT';
}
