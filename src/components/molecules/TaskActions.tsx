import { EditTaskButton } from '@/components/atoms/EditTaskButton';
import { ConfirmationDialog } from '@/components/molecules/ConfirmationDialog';
import { useTaskOperations } from '@/hooks/use-taskOperations.tsx';
import { Task } from '@/types/task.types';

interface TaskActionsProps {
  task: Task;
  onEdit: () => void;
}

export const TaskActions = ({ task, onEdit }: TaskActionsProps) => {
  const { deleteTask } = useTaskOperations();

  return (
    <div
      className="absolute right-0 top-1.5 flex items-center gap-1 bg-background ps-1 opacity-0 shadow-[-10px_0_5px_hsl(var(--background))] group-hover/card:opacity-100 focus-within:opacity-100 max-md:opacity-100"
      role="group"
      aria-label="Task actions">
      {!task.completed && <EditTaskButton onEdit={onEdit} />}
      <ConfirmationDialog
        selectedItem={task}
        entityType="task"
        onDelete={deleteTask}
      />
    </div>
  );
};
