import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useTaskOperations } from '@/hooks/use-taskOperations';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ITask } from '@/types/task.types';
import { Check } from 'lucide-react';

interface TaskCompletionButtonProps {
  task: ITask;
}

export const TaskCompletionButton = ({ task }: TaskCompletionButtonProps) => {
  const { toggleTaskComplete } = useTaskOperations();
  const { toast } = useToast();

  const handleClick = async () => {
    const newCompletedState = !task.completed;
    await toggleTaskComplete(task.id, newCompletedState);

    if (newCompletedState) {
      toast({
        title: '1 task completed',
        action: (
          <ToastAction
            altText="Undo task completion"
            onClick={() => toggleTaskComplete(task.id, false)}>
            Undo
          </ToastAction>
        ),
      });
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn('group/button mt-2 h-5 w-5 rounded-full', task.completed && 'bg-border')}
      role="checkbox"
      aria-checked={task.completed}
      aria-label={`Mark task as ${task.completed ? 'incomplete' : 'complete'}`}
      onClick={handleClick}>
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
