import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackItem } from '../components/common/TrackItem';
import { useMyTracks } from '../hooks/useMyTracks';
import './LibraryPage.css';

/**
 * 라이브러리 페이지 - 내 음악 목록 (계획 LibraryPage)
 * - 저장된 트랙 목록
 * - 삭제 기능
 * - 무한 스크롤
 */
export const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { tracks, loading, error, hasMore, fetchTracks, deleteTrack, refetch } = useMyTracks();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // 초기 로드
  useEffect(() => {
    fetchTracks(true);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

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
      {/* Header */}
      <header className="library-header">
        <h1 className="library-title">내 음악</h1>
        <button className="refresh-button" onClick={refetch} disabled={loading}>
          🔄
        </button>
      </header>

      {/* Content */}
      <main className="library-content">
        {/* Loading Initial */}
        {loading && tracks.length === 0 && (
          <div className="loading-state">
            <span className="loading-spinner">🎵</span>
            <p>음악을 불러오고 있어요...</p>
          </div>
        )}

        {/* Error */}
        {error && tracks.length === 0 && (
          <div className="error-state">
            <span className="error-icon">😔</span>
            <p>{error}</p>
            <button className="retry-button" onClick={() => fetchTracks(true)}>
              다시 시도
            </button>
          </div>
        )}

        {/* Empty State */}
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

        {/* Track List */}
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

            {/* Load More */}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">음악을 삭제할까요?</h3>
            <p className="modal-message">삭제된 음악은 복구할 수 없어요.</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={handleCancelDelete}>
                취소
              </button>
              <button className="modal-confirm" onClick={handleConfirmDelete}>
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




















