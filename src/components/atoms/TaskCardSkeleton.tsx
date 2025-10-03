import { Skeleton } from '@/components/ui/skeleton';
import { memo } from 'react';

export const TaskCardSkeleton = memo(() => {
  return (
    <div
      className="grid grid-cols-[max-content,1fr] items-center gap-3 border-b pt-2 pb-3.5"
      role="status"
      aria-live="polite"
      aria-busy="true">
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-3 me-10" />

      <span className="sr-only">Loading task...</span>
    </div>
  );
});

TaskCardSkeleton.displayName = 'TaskCardSkeleton';
