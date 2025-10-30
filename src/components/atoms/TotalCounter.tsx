import { LucideIcon } from 'lucide-react';
import { memo } from 'react';

interface TotalCounterProps {
  totalCount: number;
  icon: LucideIcon;
  label?: string;
}

export const TotalCounter = memo(({ totalCount, label = 'task', icon: Icon }: TotalCounterProps) => {
  const labelText = `${label}${totalCount !== 1 ? 's' : ''}`;

  return (
    <div
      className="flex items-center gap-1.5 text-sm text-muted-foreground"
      aria-live="polite">
      <Icon
        size={16}
        aria-hidden="true"
      />
      <span>
        {totalCount} {labelText}
      </span>
    </div>
  );
});

TotalCounter.displayName = 'TotalCounter';
