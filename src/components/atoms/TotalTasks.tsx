import { CheckCircle2 } from 'lucide-react';

interface TotalTasksProps {
  total: number;
}

export const TotalTasks = ({ total }: TotalTasksProps) => {
  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <CheckCircle2 size={16} /> {total} tasks
    </div>
  );
};
