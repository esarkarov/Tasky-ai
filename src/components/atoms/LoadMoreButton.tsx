import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';

interface LoadMoreButtonProps {
  handleLoadMore: () => void;
  isLoading: boolean;
}

export const LoadMoreButton = memo(({ handleLoadMore, isLoading }: LoadMoreButtonProps) => {
  return (
    <Button
      onClick={handleLoadMore}
      size="lg"
      disabled={isLoading}
      className="flex items-center gap-2 px-6 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label="Load more tasks">
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>Load More</>
      )}
    </Button>
  );
});

LoadMoreButton.displayName = 'LoadMoreButton';
