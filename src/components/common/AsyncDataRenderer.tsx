import type { ReactNode } from 'react';
import './AsyncDataRenderer.css';

interface AsyncDataRendererProps<T> {
  loading: boolean;
  error: string | null;
  data: T | null | undefined;
  isEmpty?: (data: T) => boolean;
  onRetry?: () => void;
  loadingContent?: ReactNode;
  errorContent?: ReactNode;
  emptyContent?: ReactNode;
  children: (data: T) => ReactNode;
}

export function AsyncDataRenderer<T>({
  loading,
  error,
  data,
  isEmpty,
  onRetry,
  loadingContent,
  errorContent,
  emptyContent,
  children,
}: AsyncDataRendererProps<T>) {
  if (loading && (!data || (Array.isArray(data) && data.length === 0))) {
    return loadingContent ? (
      <>{loadingContent}</>
    ) : (
      <div className="async-state loading-state">
        <span className="async-spinner">🎵</span>
        <p>불러오는 중...</p>
      </div>
    );
  }

  if (error && (!data || (Array.isArray(data) && data.length === 0))) {
    return errorContent ? (
      <>{errorContent}</>
    ) : (
      <div className="async-state error-state">
        <span className="async-icon">😔</span>
        <p>{error}</p>
        {onRetry && (
          <button className="retry-button" onClick={onRetry}>
            다시 시도
          </button>
        )}
      </div>
    );
  }

  if (data && isEmpty && isEmpty(data)) {
    return emptyContent ? (
      <>{emptyContent}</>
    ) : (
      <div className="async-state empty-state">
        <span className="async-icon">📭</span>
        <p>데이터가 없어요</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <>{children(data)}</>;
}
