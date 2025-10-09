import { LucideIcon } from 'lucide-react';
import { memo } from 'react';

interface TotalCounterProps {
  total: number;
  label: string;
  icon: LucideIcon;
}

export const TotalCounter = memo(({ total, label, icon: Icon }: TotalCounterProps) => {
  const displayLabel = total === 1 ? label : `${label}s`;

  return (
    <div
      className="flex items-center gap-1.5 text-sm text-muted-foreground"
      aria-live="polite">
      <Icon
        size={16}
        aria-hidden="true"
      />
      <span>
        {total} {displayLabel}
      </span>
    </div>
  );
});

TotalCounter.displayName = 'TotalCounter';
