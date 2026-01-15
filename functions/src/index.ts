import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { defineSecret } from 'firebase-functions/params';
import axios from 'axios';
import https from 'https';
import {
  EmotionKeyword,
  Track,
  GenerateMusicRequest,
  CheckStatusRequest,
  GetMyTracksRequest,
  DeleteTrackRequest,
  TossLoginRequest,
  TossTokenResponse,
  TossUserInfoResponse,
} from './types';
import {
  buildMusicPrompt,
  generateTitle,
  generateDescription,
  getAlbumArt,
} from './utils/generators';

// Firebase Admin 초기화
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

// Suno API 키 (Secret Manager에서 관리)
const SUNO_API_KEY = defineSecret('SUNO_API_KEY');
const SUNO_API_BASE = 'https://api.sunoapi.org';

// 토스 mTLS 인증서 (Secret Manager에서 관리)
const TOSS_MTLS_CERT = defineSecret('TOSS_MTLS_CERT');
const TOSS_MTLS_KEY = defineSecret('TOSS_MTLS_KEY');

// 일일 무료 크레딧
const DAILY_CREDITS = 5;

/**
 * 1. 음악 생성 요청
 * - 크레딧 확인 및 차감
 * - Suno API 호출
 * - taskId 반환
 */
export const generateMusic = functions
  .runWith({ secrets: [SUNO_API_KEY], timeoutSeconds: 300, memory: '512MB' })
  .https.onCall(async (data: GenerateMusicRequest, context) => {
    // 인증 확인
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', '로그인이 필요해요');
    }

    const userId = context.auth.uid;
    const { emotion, text } = data;

    // 감정 키워드 유효성 검사
    const validEmotions: EmotionKeyword[] = ['sad', 'anxious', 'angry', 'depressed', 'tired', 'calm'];
    if (!validEmotions.includes(emotion)) {
      throw new functions.https.HttpsError('invalid-argument', '올바른 감정을 선택해주세요');
    }

    // 사용자 문서 가져오기
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', '사용자 정보를 찾을 수 없어요');
    }

    const userData = userDoc.data()!;

    // 크레딧 확인
    if (userData.credits <= 0) {
      throw new functions.https.HttpsError('resource-exhausted', '크레딧이 부족해요. 내일 다시 시도해주세요!');
    }

    try {
      // 음악 프롬프트 생성
      const prompt = buildMusicPrompt(emotion, text);

      // Suno API 호출
      const sunoResponse = await axios.post(
        `${SUNO_API_BASE}/api/v1/generate`,
        {
          prompt,
          model: 'V4_5',
          make_instrumental: false,
        },
        {
          headers: {
            'Authorization': `Bearer ${SUNO_API_KEY.value()}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const taskId = sunoResponse.data.task_id;

      // 크레딧 차감
      await userRef.update({
        credits: admin.firestore.FieldValue.increment(-1),
      });

      return { taskId, userId };
    } catch (error) {
      console.error('Suno API 호출 실패:', error);
      throw new functions.https.HttpsError('internal', '음악 생성 요청에 실패했어요. 다시 시도해주세요.');
    }
  });

/**
 * 2. 생성 상태 확인 + 완료 시 저장
 * - Suno API 상태 조회
 * - 완료 시 Firebase Storage에 업로드
 * - Firestore에 메타데이터 저장
 */
export const checkAndSaveMusic = functions
  .runWith({ secrets: [SUNO_API_KEY], timeoutSeconds: 120, memory: '1GB' })
  .https.onCall(async (data: CheckStatusRequest, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', '로그인이 필요해요');
    }

    const { taskId, emotion, emotionText } = data;
    const userId = context.auth.uid;

    try {
      // Suno API 상태 확인
      const statusResponse = await axios.get(
        `${SUNO_API_BASE}/api/v1/music/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${SUNO_API_KEY.value()}`,
          },
          timeout: 30000,
        }
      );

      const result = statusResponse.data;

      if (result.status === 'complete' && result.audio_url) {
        // 음악 파일 다운로드
        const audioResponse = await axios.get(result.audio_url, {
          responseType: 'arraybuffer',
          timeout: 60000,
        });

        // Firebase Storage에 업로드
        const trackId = db.collection('tracks').doc().id;
        const filePath = `tracks/${userId}/${trackId}.mp3`;
        const bucket = storage.bucket();
        const file = bucket.file(filePath);

        await file.save(Buffer.from(audioResponse.data), {
          metadata: {
            contentType: 'audio/mpeg',
            metadata: {
              emotion,
              userId,
              trackId,
            },
          },
        });

        // 파일 공개 설정
        await file.makePublic();
        const audioUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

        // Firestore에 메타데이터 저장
        const trackData: Track = {
          id: trackId,
          userId,
          emotion: emotion as EmotionKeyword,
          emotionText,
          title: generateTitle(emotion as EmotionKeyword),
          description: generateDescription(emotion as EmotionKeyword),
          audioUrl,
          albumArt: getAlbumArt(emotion as EmotionKeyword),
          duration: result.duration || 60,
          createdAt: admin.firestore.Timestamp.now(),
          sunoTaskId: taskId,
        };

        await db.collection('tracks').doc(trackId).set(trackData);

        // 사용자 통계 업데이트
        await db.collection('users').doc(userId).update({
          trackCount: admin.firestore.FieldValue.increment(1),
        });

        return { status: 'complete', track: trackData };
      }

      // 아직 처리 중
      return {
        status: result.status || 'processing',
        progress: result.progress || 50,
      };
    } catch (error) {
      console.error('상태 확인 실패:', error);
      throw new functions.https.HttpsError('internal', '상태 확인에 실패했어요. 다시 시도해주세요.');
    }
  });

/**
 * 3. 내 음악 목록 조회
 */
export const getMyTracks = functions.https.onCall(async (data: GetMyTracksRequest, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요해요');
  }

  const userId = context.auth.uid;
  const { limit = 20, startAfter } = data;

  try {
    let query = db
      .collection('tracks')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(Math.min(limit, 50)); // 최대 50개로 제한

    if (startAfter) {
      const startDoc = await db.collection('tracks').doc(startAfter).get();
      if (startDoc.exists) {
        query = query.startAfter(startDoc);
      }
    }

    const snapshot = await query.get();
    const tracks = snapshot.docs.map((doc) => doc.data() as Track);

    return { tracks };
  } catch (error) {
    console.error('목록 조회 실패:', error);
    throw new functions.https.HttpsError('internal', '목록을 불러오지 못했어요.');
  }
});

/**
 * 4. 음악 삭제
 */
export const deleteTrack = functions.https.onCall(async (data: DeleteTrackRequest, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요해요');
  }

  const { trackId } = data;
  const userId = context.auth.uid;

  const trackRef = db.collection('tracks').doc(trackId);
  const trackDoc = await trackRef.get();

  if (!trackDoc.exists) {
    throw new functions.https.HttpsError('not-found', '음악을 찾을 수 없어요');
  }

  const trackData = trackDoc.data() as Track;

  if (trackData.userId !== userId) {
    throw new functions.https.HttpsError('permission-denied', '삭제 권한이 없어요');
  }

  try {
    // Storage 파일 삭제
    const filePath = `tracks/${userId}/${trackId}.mp3`;
    await storage.bucket().file(filePath).delete().catch(() => {
      // 파일이 없어도 계속 진행
      console.log('Storage 파일 없음 또는 삭제 실패');
    });

    // Firestore 문서 삭제
    await trackRef.delete();

    // 사용자 통계 업데이트
    await db.collection('users').doc(userId).update({
      trackCount: admin.firestore.FieldValue.increment(-1),
    });

    return { success: true };
  } catch (error) {
    console.error('삭제 실패:', error);
    throw new functions.https.HttpsError('internal', '삭제에 실패했어요.');
  }
});

/**
 * 5. 크레딧 일일 리셋 (Scheduled Function)
 * 매일 자정(KST)에 실행
 */
export const resetDailyCredits = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Seoul')
  .onRun(async () => {
    try {
      const usersSnapshot = await db.collection('users').get();
      const batch = db.batch();

      usersSnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, {
          credits: DAILY_CREDITS,
          lastCreditReset: admin.firestore.Timestamp.now(),
        });
      });

      await batch.commit();
      console.log(`${usersSnapshot.size}명의 크레딧이 리셋되었습니다.`);
    } catch (error) {
      console.error('크레딧 리셋 실패:', error);
    }
  });

/**
 * 6. 사용자 생성 (첫 로그인 시 자동 실행)
 */
export const createUser = functions.auth.user().onCreate(async (user) => {
  try {
    await db.collection('users').doc(user.uid).set({
      id: user.uid,
      credits: DAILY_CREDITS,
      lastCreditReset: admin.firestore.Timestamp.now(),
      createdAt: admin.firestore.Timestamp.now(),
      trackCount: 0,
    });
    console.log(`새 사용자 생성: ${user.uid}`);
  } catch (error) {
    console.error('사용자 생성 실패:', error);
  }
});

/**
 * 7. 사용자 정보 조회
 */
export const getUserInfo = functions.https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요해요');
  }

  const userId = context.auth.uid;
  const userDoc = await db.collection('users').doc(userId).get();

  if (!userDoc.exists) {
    throw new functions.https.HttpsError('not-found', '사용자 정보를 찾을 수 없어요');
  }

  return userDoc.data();
});

// 토스 API Base URL
const TOSS_API_BASE = 'https://apps-in-toss-api.toss.im';

/**
 * 8. 토스 로그인
 * - 인가 코드로 토스 AccessToken 발급
 * - Firebase Custom Token 생성 및 반환
 * - 사용자 정보 저장/업데이트
 */
export const loginWithToss = functions
  .runWith({ 
    secrets: [TOSS_MTLS_CERT, TOSS_MTLS_KEY],
    timeoutSeconds: 60, 
    memory: '256MB' 
  })
  .https.onCall(async (data: TossLoginRequest) => {
    const { authorizationCode, referrer } = data;

    if (!authorizationCode || !referrer) {
      throw new functions.https.HttpsError('invalid-argument', '인가 코드와 referrer가 필요해요');
    }

    // mTLS 에이전트 생성
    const mtlsAgent = new https.Agent({
      cert: TOSS_MTLS_CERT.value(),
      key: TOSS_MTLS_KEY.value(),
    });

    try {
      // 1. 토스 API로 AccessToken 발급
      const tokenResponse = await axios.post<TossTokenResponse>(
        `${TOSS_API_BASE}/api-partner/v1/apps-in-toss/user/oauth2/generate-token`,
        { authorizationCode, referrer },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
          httpsAgent: mtlsAgent,
        }
      );

      if (tokenResponse.data.resultType !== 'SUCCESS' || !tokenResponse.data.success) {
        console.error('토스 토큰 발급 실패:', tokenResponse.data.error);
        throw new functions.https.HttpsError('unauthenticated', '토스 로그인에 실패했어요');
      }

      const { accessToken } = tokenResponse.data.success;

      // 2. 토스 사용자 정보 조회
      const userInfoResponse = await axios.get<TossUserInfoResponse>(
        `${TOSS_API_BASE}/api-partner/v1/apps-in-toss/user/oauth2/login-me`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          timeout: 10000,
          httpsAgent: mtlsAgent,
        }
      );

      if (userInfoResponse.data.resultType !== 'SUCCESS' || !userInfoResponse.data.success) {
        console.error('토스 사용자 정보 조회 실패:', userInfoResponse.data.error);
        throw new functions.https.HttpsError('internal', '사용자 정보를 가져올 수 없어요');
      }

      const tossUser = userInfoResponse.data.success;
      const tossUserKey = tossUser.userKey;

      // 3. Firebase UID 생성 (토스 userKey 기반)
      const firebaseUid = `toss_${tossUserKey}`;

      // 4. Firestore에서 기존 사용자 확인
      const userRef = db.collection('users').doc(firebaseUid);
      const userDoc = await userRef.get();
      const isNewUser = !userDoc.exists;

      if (isNewUser) {
        // 신규 사용자 생성
        await userRef.set({
          id: firebaseUid,
          tossUserKey: tossUserKey,
          credits: DAILY_CREDITS,
          lastCreditReset: admin.firestore.Timestamp.now(),
          createdAt: admin.firestore.Timestamp.now(),
          trackCount: 0,
        });
        console.log(`새 토스 사용자 생성: ${firebaseUid}`);
      } else {
        // 기존 사용자 - 마지막 로그인 시간 업데이트
        await userRef.update({
          lastLoginAt: admin.firestore.Timestamp.now(),
        });
      }

      // 5. Firebase Custom Token 생성
      const customToken = await admin.auth().createCustomToken(firebaseUid, {
        tossUserKey: tossUserKey,
      });

      return {
        customToken,
        userKey: tossUserKey,
        isNewUser,
      };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      console.error('토스 로그인 처리 실패:', error);
      throw new functions.https.HttpsError('internal', '로그인 처리 중 오류가 발생했어요');
    }
  });

// 토스 연결 끊기 콜백 인증 정보 (Secret Manager에서 관리)
const TOSS_UNLINK_AUTH = defineSecret('TOSS_UNLINK_AUTH');

/**
 * 9. 토스 연결 끊기 콜백
 * - 토스에서 사용자가 로그인 연결을 해제했을 때 호출됨
 * - Basic Auth 헤더로 인증 검증
 * - referrer에 따라 적절한 처리 수행
 */
export const tossUnlinkCallback = functions
  .runWith({ secrets: [TOSS_UNLINK_AUTH], timeoutSeconds: 30, memory: '256MB' })
  .https.onRequest(async (req, res) => {
    // POST 메서드만 허용
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    // Basic Auth 검증
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      console.error('Basic Auth 헤더 없음');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      // Base64 디코딩하여 인증 정보 확인
      const base64Credentials = authHeader.substring(6); // 'Basic ' 제거
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const expectedAuth = TOSS_UNLINK_AUTH.value();

      if (credentials !== expectedAuth) {
        console.error('Basic Auth 인증 실패');
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // 요청 바디에서 데이터 추출
      const { userKey, referrer } = req.body;

      if (!userKey) {
        res.status(400).json({ error: 'userKey is required' });
        return;
      }

      console.log(`[토스 연결 끊기] userKey: ${userKey}, referrer: ${referrer}`);

      // Firebase UID 구성
      const firebaseUid = `toss_${userKey}`;

      // referrer에 따른 처리
      switch (referrer) {
        case 'UNLINK':
          // 사용자가 직접 연결을 끊었을 때
          console.log(`[UNLINK] 사용자가 토스앱에서 연결을 해제함: ${firebaseUid}`);
          break;

        case 'WITHDRAWAL_TERMS':
          // 로그인 서비스 약관 철회
          console.log(`[WITHDRAWAL_TERMS] 약관 동의 철회: ${firebaseUid}`);
          break;

        case 'WITHDRAWAL_TOSS':
          // 토스 회원 탈퇴
          console.log(`[WITHDRAWAL_TOSS] 토스 회원 탈퇴: ${firebaseUid}`);
          break;

        default:
          console.log(`[UNKNOWN] 알 수 없는 referrer: ${referrer}, userKey: ${userKey}`);
      }

      // Firestore에서 사용자의 토스 연결 상태 업데이트
      const userRef = db.collection('users').doc(firebaseUid);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        await userRef.update({
          tossUnlinkedAt: admin.firestore.Timestamp.now(),
          tossUnlinkReason: referrer || 'UNKNOWN',
          isLinkedToToss: false,
        });
        console.log(`[토스 연결 끊기] Firestore 업데이트 완료: ${firebaseUid}`);

        // 선택: 토스 탈퇴의 경우 사용자 데이터 삭제 처리
        if (referrer === 'WITHDRAWAL_TOSS') {
          // TODO: 필요시 사용자 데이터 삭제 로직 추가
          // 예: 일정 기간 후 자동 삭제를 위해 삭제 예정 마킹
          await userRef.update({
            scheduledForDeletion: true,
            deletionScheduledAt: admin.firestore.Timestamp.now(),
          });
        }
      } else {
        console.log(`[토스 연결 끊기] 사용자 없음: ${firebaseUid}`);
      }

      // 성공 응답
      res.status(200).json({ 
        success: true, 
        message: '연결 끊기 처리 완료',
        userKey,
        referrer,
      });
    } catch (error) {
      console.error('[토스 연결 끊기] 오류:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});







