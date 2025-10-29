import { INITIAL_COUNT, PAGE_SIZE } from '@/constants/pagination';
import { TIMING } from '@/constants/timing';
import { UseLoadMoreParams, UseLoadMoreResult } from '@/types/hooks.types';
import { CSSProperties, useCallback, useState } from 'react';

export const useLoadMore = <T>(items: T[], params: UseLoadMoreParams = {}): UseLoadMoreResult<T> => {
  const { initialCount = INITIAL_COUNT, pageSize = PAGE_SIZE } = params;

  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const totalCount = items.length;
  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < totalCount;

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setIsLoading(false);
    }, TIMING.LOAD_DELAY);
  }, []);

  const reset = useCallback(() => {
    setVisibleCount(initialCount);
    setIsLoading(false);
  }, [initialCount]);

  const getItemClassName = useCallback(
    (index: number) => {
      const isNewlyAdded = index >= visibleCount - pageSize;
      return isNewlyAdded ? 'animate-in fade-in slide-in-from-bottom-4 duration-300' : '';
    },
    [visibleCount, pageSize]
  );

  const getItemStyle = useCallback(
    (index: number): CSSProperties => {
      const isNewlyAdded = index >= visibleCount - pageSize;
      return {
        animationDelay: isNewlyAdded ? `${(index - (visibleCount - pageSize)) * 50}ms` : '0ms',
      };
    },
    [visibleCount, pageSize]
  );

  return {
    visibleItems,
    visibleCount,
    isLoading,
    hasMore,
    handleLoadMore,
    reset,
    getItemClassName,
    getItemStyle,
  };
};
