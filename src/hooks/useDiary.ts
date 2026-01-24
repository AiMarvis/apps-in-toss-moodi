import { useState, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { getErrorMessage } from '../utils/errorHandler';
import type { DiaryEntry, CreateDiaryRequest } from '../types/diary';

interface DiaryState {
  diaries: DiaryEntry[];
  loading: boolean;
  error: string | null;
}

interface UseDiaryReturn extends DiaryState {
  fetchDiariesByMonth: (year: number, month: number) => Promise<void>;
  fetchDiariesByDate: (dateString: string) => Promise<DiaryEntry[]>;
  addDiary: (request: CreateDiaryRequest) => Promise<DiaryEntry | null>;
  deleteDiary: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useDiary(): UseDiaryReturn {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<{ year: number; month: number } | null>(null);

  const fetchDiariesByMonth = useCallback(async (year: number, month: number) => {
    const user = auth.currentUser;
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentFilter({ year, month });

    try {
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endMonth = month === 11 ? 0 : month + 1;
      const endYear = month === 11 ? year + 1 : year;
      const endDate = `${endYear}-${String(endMonth + 1).padStart(2, '0')}-01`;

      const diariesRef = collection(db, 'diaries');
      const q = query(
        diariesRef,
        where('userId', '==', user.uid),
        where('date', '>=', startDate),
        where('date', '<', endDate),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      const fetchedDiaries: DiaryEntry[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId,
          date: data.date,
          emotion: data.emotion,
          content: data.content,
          trackId: data.trackId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });

      setDiaries(fetchedDiaries);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDiariesByDate = useCallback(async (dateString: string): Promise<DiaryEntry[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const diariesRef = collection(db, 'diaries');
      const q = query(
        diariesRef,
        where('userId', '==', user.uid),
        where('date', '==', dateString),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId,
          date: data.date,
          emotion: data.emotion,
          content: data.content,
          trackId: data.trackId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
    } catch {
      return [];
    }
  }, []);

  const addDiary = useCallback(async (request: CreateDiaryRequest): Promise<DiaryEntry | null> => {
    const user = auth.currentUser;
    if (!user) {
      setError('로그인이 필요합니다.');
      return null;
    }

    try {
      const now = Timestamp.now();
      const diaryData = {
        userId: user.uid,
        date: request.date,
        emotion: request.emotion,
        content: request.content,
        trackId: request.trackId || undefined,
        createdAt: now,
        updatedAt: now,
      };

      const diariesRef = collection(db, 'diaries');
      const docRef = await addDoc(diariesRef, diaryData);

      const newDiary: DiaryEntry = {
        id: docRef.id,
        ...diaryData,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      };

      setDiaries(prev => [newDiary, ...prev]);
      return newDiary;
    } catch {
      setError('다이어리 저장에 실패했어요.');
      return null;
    }
  }, []);

  const deleteDiary = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'diaries', id));
      setDiaries(prev => prev.filter(d => d.id !== id));
      return true;
    } catch {
      setError('다이어리 삭제에 실패했어요.');
      return false;
    }
  }, []);

  const refetch = useCallback(async () => {
    if (currentFilter) {
      await fetchDiariesByMonth(currentFilter.year, currentFilter.month);
    }
  }, [currentFilter, fetchDiariesByMonth]);

  return {
    diaries,
    loading,
    error,
    fetchDiariesByMonth,
    fetchDiariesByDate,
    addDiary,
    deleteDiary,
    refetch,
  };
}
