import { generateMusicFn, checkAndSaveMusicFn } from '../lib/firebase';
import type { EmotionKeyword, Track } from '../types/emotion';

export interface GenerateMusicParams {
  emotion: EmotionKeyword;
  text?: string;
  instrumental?: boolean;
  musicType?: string;
}

export interface GenerateMusicResult {
  taskId: string;
  userId: string;
}

export interface CheckMusicStatusParams {
  taskId: string;
  emotion: EmotionKeyword;
  emotionText?: string;
}

export interface CheckMusicStatusResult {
  status: string;
  progress?: number;
  track?: Track;
}

export async function generateMusic(params: GenerateMusicParams): Promise<GenerateMusicResult> {
  const result = await generateMusicFn(params);
  return result.data;
}

export async function checkAndSaveMusic(params: CheckMusicStatusParams): Promise<CheckMusicStatusResult> {
  const result = await checkAndSaveMusicFn(params);
  return result.data;
}
