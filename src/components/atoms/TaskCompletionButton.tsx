import { Button } from '@/components/ui/button';
import { useTaskOperations } from '@/hooks/use-taskOperations.tsx';
import { cn } from '@/lib/utils';
import { ITask } from '@/types/task.types';
import { Check } from 'lucide-react';

interface TaskCompletionButtonProps {
  task: ITask;
}

export const TaskCompletionButton = ({ task }: TaskCompletionButtonProps) => {
  const { toggleTaskComplete } = useTaskOperations({
    enableUndo: true,
  });

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn('group/button mt-2 h-5 w-5 rounded-full', task.completed && 'bg-border')}
      role="checkbox"
      aria-checked={task.completed}
      aria-label={`Mark task as ${task.completed ? 'incomplete' : 'complete'}`}
      onClick={async () => {
        await toggleTaskComplete(task.id, !task.completed);
      }}>
      <Check
        strokeWidth={4}
        className={cn(
          '!h-3 !w-3 text-muted-foreground transition-opacity group-hover/button:opacity-100',
          task.completed ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden="true"
      />
    </Button>
  );
};
