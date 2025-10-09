import { cn, formatCustomDate, getTaskDueDateColorClass } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';

interface DueDateProps {
  completed: boolean;
  date: string | Date | null;
}

export const TaskDueDate = ({ completed, date }: DueDateProps) => {
  if (!date) return null;
  const formattedDate = formatCustomDate(date);
  const dateTime = new Date(date).toISOString();

  return (
    <div
      className={cn(
        'flex items-center gap-1 text-xs text-muted-foreground',
        getTaskDueDateColorClass(date as Date, completed)
      )}
      aria-label="Task due date">
      <CalendarDays
        size={14}
        aria-hidden="true"
      />
      <time dateTime={dateTime}>{formattedDate}</time>
    </div>
  );
};
