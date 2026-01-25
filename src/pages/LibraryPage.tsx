import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackItem } from '../components/common/TrackItem';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { useMyTracks } from '../hooks/useMyTracks';
import MoodiLoading from '../assets/moodi-loading.png';
import './LibraryPage.css';

export const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { tracks, loading, error, hasMore, fetchTracks, deleteTrack, refetch } = useMyTracks();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleInitialFetch = useCallback(() => {
    fetchTracks(true);
  }, [fetchTracks]);

  useEffect(() => {
    handleInitialFetch();
  }, [handleInitialFetch]);

  const handleTrackClick = (track: typeof tracks[0]) => {
    navigate('/player', { state: { track } });
  };

  const handleDeleteClick = (trackId: string) => {
    setDeleteConfirm(trackId);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm) {
      const success = await deleteTrack(deleteConfirm);
      if (success) {
        setDeleteConfirm(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchTracks(false);
    }
  };

  return (
    <div className="library-page">
      <header className="library-header">
        <h1 className="library-title">내 음악</h1>
        <button className="refresh-button" onClick={refetch} disabled={loading}>
          🔄
        </button>
      </header>

      <main className="library-content">
        {loading && tracks.length === 0 && (
          <div className="loading-state">
            <img src={MoodiLoading} alt="로딩 중" className="loading-spinner-img" />
            <p>음악을 불러오고 있어요...</p>
          </div>
        )}

        {error && tracks.length === 0 && (
          <div className="error-state">
            <span className="error-icon">😔</span>
            <p>{error}</p>
            <button className="retry-button" onClick={() => fetchTracks(true)}>
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && tracks.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🎶</span>
            <p className="empty-title">아직 만든 음악이 없어요</p>
            <p className="empty-subtitle">지금 바로 나만의 음악을 만들어보세요!</p>
            <button className="create-button" onClick={() => navigate('/')}>
              🎵 음악 만들러 가기
            </button>
          </div>
        )}

        {tracks.length > 0 && (
          <div className="track-list">
            {tracks.map((track) => (
              <TrackItem
                key={track.id}
                track={track}
                onClick={() => handleTrackClick(track)}
                onDelete={() => handleDeleteClick(track.id)}
                showDelete={true}
              />
            ))}

            {hasMore && (
              <button
                className="load-more-button"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? '불러오는 중...' : '더 보기'}
              </button>
            )}
          </div>
        )}
      </main>

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="음악을 삭제할까요?"
        message="삭제된 음악은 복구할 수 없어요."
        confirmText="삭제하기"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />
    </div>
  );
};
