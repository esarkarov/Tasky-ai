import { ClipboardCheck } from 'lucide-react';

interface TotalTasksProps {
  total: number;
}

export const TotalTasks = ({ total }: TotalTasksProps) => {
  return (
    <div
      className="flex items-center gap-1.5 text-sm text-muted-foreground"
      aria-live="polite">
      <ClipboardCheck
        size={16}
        aria-hidden="true"
      />
      <span>
        {total} {total === 1 ? 'task' : 'tasks'}
      </span>
    </div>
  );
};
