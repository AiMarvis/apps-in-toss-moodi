"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.grantCredits = exports.sunoCallback = exports.tossUnlinkCallback = exports.loginWithToss = exports.getUserInfo = exports.createUser = exports.deleteTrack = exports.getMyTracks = exports.checkAndSaveMusic = exports.generateMusic = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const params_1 = require("firebase-functions/params");
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
const generators_1 = require("./utils/generators");
// Firebase Admin 초기화
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();
// Suno API 키 (Secret Manager에서 관리)
const SUNO_API_KEY = (0, params_1.defineSecret)('SUNO_API_KEY');
const SUNO_API_BASE = 'https://api.sunoapi.org';
// 토스 mTLS 인증서 (Secret Manager에서 관리)
const TOSS_MTLS_CERT = (0, params_1.defineSecret)('TOSS_MTLS_CERT');
const TOSS_MTLS_KEY = (0, params_1.defineSecret)('TOSS_MTLS_KEY');
// 첫 가입 시 증정 크레딧
const INITIAL_CREDITS = 5;
/**
 * 1. 음악 생성 요청
 * - 크레딧 확인 및 차감
 * - Suno API 호출
 * - taskId 반환
 */
exports.generateMusic = functions
    .runWith({ secrets: [SUNO_API_KEY], timeoutSeconds: 300, memory: '512MB' })
    .https.onCall(async (data, context) => {
    var _a, _b, _c, _d;
    // 인증 확인
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', '로그인이 필요해요');
    }
    const userId = context.auth.uid;
    const { emotion, text, instrumental, musicType, lyricsLanguage } = data;
    // 감정 키워드 유효성 검사
    const validEmotions = [
        'sad', 'anxious', 'angry', 'depressed', 'tired', 'calm',
        'happy', 'excited', 'grateful',
        'nostalgic', 'bittersweet', 'cozy', 'hopeful', 'empty',
        'lonely', 'stressed', 'frustrated', 'disappointed',
    ];
    if (!validEmotions.includes(emotion)) {
        throw new functions.https.HttpsError('invalid-argument', '올바른 감정을 선택해주세요');
    }
    // 사용자 문서 가져오기
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', '사용자 정보를 찾을 수 없어요');
    }
    const userData = userDoc.data();
    // 크레딧 확인
    if (userData.credits <= 0) {
        throw new functions.https.HttpsError('resource-exhausted', '크레딧이 부족해요. 내일 다시 시도해주세요!');
    }
    try {
        // 음악 프롬프트 생성 (스타일 및 가사 힌트 반영)
        let prompt = (0, generators_1.buildMusicPrompt)(emotion, text, musicType, instrumental, lyricsLanguage);
        // Suno API 호출 (콜백 URL 포함)
        const callBackUrl = 'https://us-central1-moodi-b8811.cloudfunctions.net/sunoCallback';
        let sunoResponse;
        try {
            sunoResponse = await axios_1.default.post(`${SUNO_API_BASE}/api/v1/generate`, {
                prompt,
                model: 'V4_5ALL',
                instrumental: instrumental !== null && instrumental !== void 0 ? instrumental : false,
                customMode: !instrumental,
                callBackUrl,
            }, {
                headers: {
                    'Authorization': `Bearer ${SUNO_API_KEY.value().trim()}`,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });
        }
        catch (apiError) {
            // 아티스트 이름 오인식 에러 시 사용자 텍스트 제외하고 재시도
            const axiosError = apiError;
            if (((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status) === 400 &&
                ((_d = (_c = (_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.msg) === null || _d === void 0 ? void 0 : _d.includes('artist name'))) {
                console.log('[Fallback] 아티스트 이름 오인식으로 재시도 (텍스트 제외)');
                prompt = (0, generators_1.buildMusicPrompt)(emotion, undefined, musicType, instrumental, lyricsLanguage);
                sunoResponse = await axios_1.default.post(`${SUNO_API_BASE}/api/v1/generate`, {
                    prompt,
                    model: 'V4_5ALL',
                    instrumental: instrumental !== null && instrumental !== void 0 ? instrumental : false,
                    customMode: !instrumental,
                    callBackUrl,
                }, {
                    headers: {
                        'Authorization': `Bearer ${SUNO_API_KEY.value().trim()}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000,
                });
            }
            else {
                throw apiError;
            }
        }
        const taskId = sunoResponse.data.data.taskId;
        // Firestore에 pending 상태로 작업 저장
        await db.collection('pendingTasks').doc(taskId).set({
            taskId,
            userId,
            emotion,
            emotionText: text,
            status: 'pending',
            createdAt: admin.firestore.Timestamp.now(),
        });
        // 크레딧 차감
        await userRef.update({
            credits: admin.firestore.FieldValue.increment(-1),
        });
        return { taskId, userId };
    }
    catch (error) {
        console.error('Suno API 호출 실패:', error);
        throw new functions.https.HttpsError('internal', '음악 생성 요청에 실패했어요. 다시 시도해주세요.');
    }
});
/**
 * 2. 생성 상태 확인 + 완료 시 저장
 * - 먼저 pendingTasks에서 콜백 처리 완료 여부 확인
 * - 미완료 시 Suno API 상태 조회 (폴링 방식 fallback)
 * - 완료 시 Firebase Storage에 업로드
 * - Firestore에 메타데이터 저장
 */
exports.checkAndSaveMusic = functions
    .runWith({ secrets: [SUNO_API_KEY], timeoutSeconds: 120, memory: '1GB' })
    .https.onCall(async (data, context) => {
    var _a, _b, _c;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', '로그인이 필요해요');
    }
    const { taskId, emotion, emotionText } = data;
    const userId = context.auth.uid;
    try {
        // 1. pendingTasks에서 콜백 처리 완료 여부 확인
        const pendingTaskDoc = await db.collection('pendingTasks').doc(taskId).get();
        console.log(`[checkAndSaveMusic] taskId: ${taskId}, pendingTask exists: ${pendingTaskDoc.exists}`);
        if (pendingTaskDoc.exists) {
            const pendingTask = pendingTaskDoc.data();
            console.log(`[checkAndSaveMusic] pendingTask status: ${pendingTask.status}, trackId: ${pendingTask.trackId}`);
            // 콜백으로 이미 완료된 경우 - tracks에서 조회하여 반환
            if (pendingTask.status === 'completed' && pendingTask.trackId) {
                console.log(`[checkAndSaveMusic] Callback completed, fetching track: ${pendingTask.trackId}`);
                const trackDoc = await db.collection('tracks').doc(pendingTask.trackId).get();
                console.log(`[checkAndSaveMusic] Track exists: ${trackDoc.exists}`);
                if (trackDoc.exists) {
                    const track = trackDoc.data();
                    console.log(`[checkAndSaveMusic] Returning track: ${track.id}, audioUrl: ${track.audioUrl}`);
                    // 페어 트랙이 있으면 함께 반환
                    let pairTrack = null;
                    if (track.pairId) {
                        const pairSnapshot = await db.collection('tracks')
                            .where('pairId', '==', track.pairId)
                            .where('id', '!=', track.id)
                            .limit(1)
                            .get();
                        if (!pairSnapshot.empty) {
                            pairTrack = pairSnapshot.docs[0].data();
                        }
                    }
                    return {
                        status: 'complete',
                        track,
                        pairTrack, // 페어 트랙 (null이면 단일 곡)
                    };
                }
            }
            // 콜백에서 실패 처리된 경우
            if (pendingTask.status === 'failed') {
                console.log(`[checkAndSaveMusic] Task failed: ${pendingTask.errorMessage}`);
                throw new functions.https.HttpsError('internal', pendingTask.errorMessage || '음악 생성에 실패했어요.');
            }
            console.log(`[checkAndSaveMusic] Callback not completed yet, status: ${pendingTask.status}`);
        }
        else {
            console.log(`[checkAndSaveMusic] pendingTask not found: ${taskId}`);
        }
        // 2. 아직 콜백이 처리되지 않은 경우 - Suno API 직접 조회 (fallback)
        console.log(`[checkAndSaveMusic] Falling back to Suno API polling for taskId: ${taskId}`);
        const statusResponse = await axios_1.default.get(`${SUNO_API_BASE}/api/v1/generate/record-info?taskId=${taskId}`, {
            headers: {
                'Authorization': `Bearer ${SUNO_API_KEY.value().trim()}`,
            },
            timeout: 30000,
        });
        const apiResponse = statusResponse.data;
        const taskData = apiResponse.data;
        const taskStatus = taskData === null || taskData === void 0 ? void 0 : taskData.status;
        // 성공: status가 'SUCCESS'이고 response.data에 오디오 정보가 있을 때
        if (taskStatus === 'SUCCESS' && ((_c = (_b = (_a = taskData === null || taskData === void 0 ? void 0 : taskData.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.audio_url)) {
            const responseDataArray = taskData.response.data;
            const pairId = db.collection('tracks').doc().id;
            const savedTracks = [];
            // 모든 곡 저장 (Suno는 기본 2곡 생성)
            for (let i = 0; i < responseDataArray.length; i++) {
                const audioInfo = responseDataArray[i];
                if (!(audioInfo === null || audioInfo === void 0 ? void 0 : audioInfo.audio_url))
                    continue;
                // 음악 파일 다운로드
                const audioResponse = await axios_1.default.get(audioInfo.audio_url, {
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
                const trackData = {
                    id: trackId,
                    userId,
                    emotion: emotion,
                    emotionText,
                    title: (0, generators_1.generateTitle)(emotion),
                    description: (0, generators_1.generateDescription)(emotion),
                    audioUrl,
                    albumArt: (0, generators_1.getAlbumArt)(emotion),
                    duration: audioInfo.duration || 60,
                    createdAt: admin.firestore.Timestamp.now(),
                    sunoTaskId: taskId,
                    pairId, // 같은 요청에서 생성된 곡들은 동일한 pairId
                };
                await db.collection('tracks').doc(trackId).set(trackData);
                savedTracks.push(trackData);
            }
            // 사용자 통계 업데이트 (저장된 곡 수만큼)
            await db.collection('users').doc(userId).update({
                trackCount: admin.firestore.FieldValue.increment(savedTracks.length),
            });
            return {
                status: 'complete',
                track: savedTracks[0],
                pairTrack: savedTracks[1] || null,
            };
        }
        // 실패 상태 처리
        if (taskStatus === 'FAILED') {
            const errorMessage = (taskData === null || taskData === void 0 ? void 0 : taskData.errorMessage) || '음악 생성에 실패했어요.';
            throw new functions.https.HttpsError('internal', errorMessage);
        }
        // 아직 처리 중 (GENERATING, PENDING)
        return {
            status: taskStatus === 'GENERATING' ? 'processing' : (taskStatus || 'processing'),
            progress: taskStatus === 'GENERATING' ? 50 : 30,
        };
    }
    catch (error) {
        // Suno API 폴링 실패 (타임아웃 등) - 콜백이 아직 처리 중일 수 있음
        console.error('[checkAndSaveMusic] Suno API 폴링 실패:', error);
        // pendingTask가 아직 존재하고 failed가 아니면 계속 기다리도록 processing 반환
        const pendingTaskDoc = await db.collection('pendingTasks').doc(taskId).get();
        if (pendingTaskDoc.exists) {
            const pendingTask = pendingTaskDoc.data();
            // 콜백이 완료된 경우 - 트랙 반환
            if (pendingTask.status === 'completed' && pendingTask.trackId) {
                console.log(`[checkAndSaveMusic] 폴링 실패했지만 콜백 완료됨, trackId: ${pendingTask.trackId}`);
                const trackDoc = await db.collection('tracks').doc(pendingTask.trackId).get();
                if (trackDoc.exists) {
                    const track = trackDoc.data();
                    return { status: 'complete', track };
                }
            }
            // 실패 상태가 아니면 계속 기다리라고 processing 반환
            if (pendingTask.status !== 'failed') {
                console.log(`[checkAndSaveMusic] 폴링 실패했지만 pendingTask 상태: ${pendingTask.status}, 계속 대기`);
                return {
                    status: 'processing',
                    progress: 40,
                };
            }
        }
        // 정말 실패한 경우에만 에러 던지기
        throw new functions.https.HttpsError('internal', '상태 확인에 실패했어요. 다시 시도해주세요.');
    }
});
/**
 * 3. 내 음악 목록 조회
 */
exports.getMyTracks = functions.https.onCall(async (data, context) => {
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
        const tracks = snapshot.docs.map((doc) => doc.data());
        return { tracks };
    }
    catch (error) {
        console.error('목록 조회 실패:', error);
        throw new functions.https.HttpsError('internal', '목록을 불러오지 못했어요.');
    }
});
/**
 * 4. 음악 삭제
 */
exports.deleteTrack = functions.https.onCall(async (data, context) => {
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
    const trackData = trackDoc.data();
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
    }
    catch (error) {
        console.error('삭제 실패:', error);
        throw new functions.https.HttpsError('internal', '삭제에 실패했어요.');
    }
});
/**
 * 6. 사용자 생성 (첫 로그인 시 자동 실행)
 */
exports.createUser = functions.auth.user().onCreate(async (user) => {
    try {
        await db.collection('users').doc(user.uid).set({
            id: user.uid,
            credits: INITIAL_CREDITS,
            lastCreditReset: admin.firestore.Timestamp.now(),
            createdAt: admin.firestore.Timestamp.now(),
            trackCount: 0,
        });
        console.log(`새 사용자 생성: ${user.uid}`);
    }
    catch (error) {
        console.error('사용자 생성 실패:', error);
    }
});
/**
 * 7. 사용자 정보 조회
 */
exports.getUserInfo = functions.https.onCall(async (_data, context) => {
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
exports.loginWithToss = functions
    .runWith({
    secrets: [TOSS_MTLS_CERT, TOSS_MTLS_KEY],
    timeoutSeconds: 60,
    memory: '256MB'
})
    .https.onCall(async (data) => {
    const { authorizationCode, referrer } = data;
    if (!authorizationCode || !referrer) {
        throw new functions.https.HttpsError('invalid-argument', '인가 코드와 referrer가 필요해요');
    }
    // mTLS 에이전트 생성
    const mtlsAgent = new https_1.default.Agent({
        cert: TOSS_MTLS_CERT.value(),
        key: TOSS_MTLS_KEY.value(),
    });
    try {
        // 1. 토스 API로 AccessToken 발급
        const tokenResponse = await axios_1.default.post(`${TOSS_API_BASE}/api-partner/v1/apps-in-toss/user/oauth2/generate-token`, { authorizationCode, referrer }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000,
            httpsAgent: mtlsAgent,
        });
        if (tokenResponse.data.resultType !== 'SUCCESS' || !tokenResponse.data.success) {
            console.error('토스 토큰 발급 실패:', tokenResponse.data.error);
            throw new functions.https.HttpsError('unauthenticated', '토스 로그인에 실패했어요');
        }
        const { accessToken } = tokenResponse.data.success;
        // 2. 토스 사용자 정보 조회
        const userInfoResponse = await axios_1.default.get(`${TOSS_API_BASE}/api-partner/v1/apps-in-toss/user/oauth2/login-me`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            timeout: 10000,
            httpsAgent: mtlsAgent,
        });
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
                credits: INITIAL_CREDITS,
                lastCreditReset: admin.firestore.Timestamp.now(),
                createdAt: admin.firestore.Timestamp.now(),
                trackCount: 0,
            });
            console.log(`새 토스 사용자 생성: ${firebaseUid}`);
        }
        else {
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
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        console.error('토스 로그인 처리 실패:', error);
        throw new functions.https.HttpsError('internal', '로그인 처리 중 오류가 발생했어요');
    }
});
// 토스 연결 끊기 콜백 인증 정보 (Secret Manager에서 관리)
const TOSS_UNLINK_AUTH = (0, params_1.defineSecret)('TOSS_UNLINK_AUTH');
/**
 * 9. 토스 연결 끊기 콜백
 * - 토스에서 사용자가 로그인 연결을 해제했을 때 호출됨
 * - Basic Auth 헤더로 인증 검증
 * - referrer에 따라 적절한 처리 수행
 */
exports.tossUnlinkCallback = functions
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
        }
        else {
            console.log(`[토스 연결 끊기] 사용자 없음: ${firebaseUid}`);
        }
        // 성공 응답
        res.status(200).json({
            success: true,
            message: '연결 끊기 처리 완료',
            userKey,
            referrer,
        });
    }
    catch (error) {
        console.error('[토스 연결 끊기] 오류:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
/**
 * 10. Suno API 콜백 (Webhook)
 * - Suno API가 음악 생성 완료 시 호출
 * - Firebase Storage에 음악 파일 업로드
 * - Firestore에 트랙 메타데이터 저장
 */
exports.sunoCallback = functions
    .runWith({ timeoutSeconds: 120, memory: '1GB' })
    .https.onRequest(async (req, res) => {
    var _a, _b, _c, _d;
    // POST 메서드만 허용
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    try {
        const callbackData = req.body;
        console.log('[Suno Callback] 수신:', JSON.stringify(callbackData));
        // Suno API 실제 콜백 데이터 구조:
        // { code: 200, data: { callbackType: "complete", data: [...], task_id: "..." }, msg: "..." }
        const taskId = (_a = callbackData.data) === null || _a === void 0 ? void 0 : _a.task_id;
        const callbackType = (_b = callbackData.data) === null || _b === void 0 ? void 0 : _b.callbackType;
        const responseData = (_c = callbackData.data) === null || _c === void 0 ? void 0 : _c.data;
        if (!taskId) {
            console.error('[Suno Callback] taskId 없음');
            res.status(400).json({ error: 'taskId is required' });
            return;
        }
        console.log(`[Suno Callback] taskId: ${taskId}, callbackType: ${callbackType}`);
        // pendingTasks에서 작업 정보 조회
        const pendingTaskRef = db.collection('pendingTasks').doc(taskId);
        const pendingTaskDoc = await pendingTaskRef.get();
        if (!pendingTaskDoc.exists) {
            console.error(`[Suno Callback] 작업 없음: ${taskId}`);
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        const pendingTask = pendingTaskDoc.data();
        const userId = pendingTask.userId;
        const emotion = pendingTask.emotion;
        const emotionText = pendingTask.emotionText;
        // "complete" 콜백이고 오디오 URL이 있을 때 - 모든 곡 저장 (2곡 제공)
        if (callbackType === 'complete' && (responseData === null || responseData === void 0 ? void 0 : responseData.length) > 0 && ((_d = responseData[0]) === null || _d === void 0 ? void 0 : _d.audio_url)) {
            // 페어 ID 생성 (동일 요청에서 생성된 곡들을 연결)
            const pairId = db.collection('tracks').doc().id;
            const savedTrackIds = [];
            // 모든 곡 저장 (Suno는 기본 2곡 생성)
            for (let i = 0; i < responseData.length; i++) {
                const audioInfo = responseData[i];
                if (!(audioInfo === null || audioInfo === void 0 ? void 0 : audioInfo.audio_url))
                    continue;
                console.log(`[Suno Callback] 음악 다운로드 시작 (${i + 1}/${responseData.length}): ${audioInfo.audio_url}`);
                // 음악 파일 다운로드
                const audioResponse = await axios_1.default.get(audioInfo.audio_url, {
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
                const trackData = {
                    id: trackId,
                    userId,
                    emotion: emotion,
                    emotionText,
                    title: (0, generators_1.generateTitle)(emotion),
                    description: (0, generators_1.generateDescription)(emotion),
                    audioUrl,
                    albumArt: (0, generators_1.getAlbumArt)(emotion),
                    duration: audioInfo.duration || 60,
                    createdAt: admin.firestore.Timestamp.now(),
                    sunoTaskId: taskId,
                    pairId, // 같은 요청에서 생성된 곡들은 동일한 pairId
                };
                await db.collection('tracks').doc(trackId).set(trackData);
                savedTrackIds.push(trackId);
                console.log(`[Suno Callback] 트랙 저장 완료 (${i + 1}/${responseData.length}): ${trackId}`);
            }
            // 사용자 통계 업데이트 (저장된 곡 수만큼)
            await db.collection('users').doc(userId).update({
                trackCount: admin.firestore.FieldValue.increment(savedTrackIds.length),
            });
            // pendingTask 완료 상태로 업데이트 (첫 번째 trackId 저장 - 폴링 호환성)
            await pendingTaskRef.update({
                status: 'completed',
                trackId: savedTrackIds[0],
                trackIds: savedTrackIds,
                updatedAt: admin.firestore.Timestamp.now(),
            });
            // 첫 번째 트랙에 대해 diary 자동 저장 (프론트엔드 에러 시에도 기록 보존)
            const now = new Date();
            const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
            const today = kstDate.toISOString().split('T')[0];
            const firstTrackDoc = await db.collection('tracks').doc(savedTrackIds[0]).get();
            if (firstTrackDoc.exists) {
                const firstTrack = firstTrackDoc.data();
                await db.collection('diaries').add({
                    userId,
                    date: today,
                    emotion: emotion,
                    content: emotionText || firstTrack.description || '',
                    trackId: savedTrackIds[0],
                    createdAt: admin.firestore.Timestamp.now(),
                    updatedAt: admin.firestore.Timestamp.now(),
                });
                console.log(`[Suno Callback] 일기 자동 저장 완료: ${today}, emotion: ${emotion}`);
            }
            console.log(`[Suno Callback] 작업 완료: ${taskId}, 저장된 트랙: ${savedTrackIds.length}개`);
            res.status(200).json({ success: true, status: 'completed', trackIds: savedTrackIds });
            return;
        }
        // 아직 진행 중인 상태 (text, first 콜백)
        await pendingTaskRef.update({
            status: callbackType || 'processing',
            updatedAt: admin.firestore.Timestamp.now(),
        });
        console.log(`[Suno Callback] 진행 중: ${taskId}, callbackType: ${callbackType}`);
        res.status(200).json({ success: true, status: callbackType || 'processing' });
    }
    catch (error) {
        console.error('[Suno Callback] 오류:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// SKU → 크레딧 매핑 (서버에서 검증)
const SKU_CREDITS_MAP = {
    'moodi.credit.10': 10,
    'moodi.credit.33': 33,
};
/**
 * 11. 인앱결제 크레딧 지급
 * - orderId로 중복 지급 방지
 * - SKU로 크레딧 수량 검증
 * - 트랜잭션으로 크레딧 지급 + 주문 기록
 */
exports.grantCredits = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', '로그인이 필요해요');
    }
    const { orderId, sku } = data;
    const userId = context.auth.uid;
    // 1. SKU 유효성 검사
    const creditsToGrant = SKU_CREDITS_MAP[sku];
    if (!creditsToGrant) {
        throw new functions.https.HttpsError('invalid-argument', '유효하지 않은 상품이에요');
    }
    // 2. 중복 지급 방지
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    if (orderDoc.exists && ((_a = orderDoc.data()) === null || _a === void 0 ? void 0 : _a.granted)) {
        // 이미 지급됨 - 성공으로 응답 (멱등성 보장)
        console.log(`[grantCredits] 이미 지급된 주문: ${orderId}`);
        return { success: true, credits: creditsToGrant, alreadyGranted: true };
    }
    // 3. 트랜잭션으로 크레딧 지급 + 주문 기록
    try {
        await db.runTransaction(async (transaction) => {
            const userRef = db.collection('users').doc(userId);
            transaction.update(userRef, {
                credits: admin.firestore.FieldValue.increment(creditsToGrant),
            });
            transaction.set(orderRef, {
                orderId,
                userId,
                sku,
                credits: creditsToGrant,
                granted: true,
                grantedAt: admin.firestore.Timestamp.now(),
            });
        });
        console.log(`[grantCredits] ${userId}에게 ${creditsToGrant}크레딧 지급 완료 (주문: ${orderId})`);
        return { success: true, credits: creditsToGrant };
    }
    catch (error) {
        console.error('[grantCredits] 크레딧 지급 실패:', error);
        throw new functions.https.HttpsError('internal', '크레딧 지급에 실패했어요. 다시 시도해주세요.');
    }
});
//# sourceMappingURL=index.js.map