import { getMyTracksFn, deleteTrackFn } from '../lib/firebase';
import type { Track } from '../types/emotion';

export interface GetMyTracksParams {
  limit?: number;
  startAfter?: string;
}

export interface GetMyTracksResult {
  tracks: Track[];
}

export async function getMyTracks(params: GetMyTracksParams = {}): Promise<GetMyTracksResult> {
  const result = await getMyTracksFn(params);
  return result.data;
}

export async function deleteTrack(trackId: string): Promise<boolean> {
  const result = await deleteTrackFn({ trackId });
  return result.data.success;
}
