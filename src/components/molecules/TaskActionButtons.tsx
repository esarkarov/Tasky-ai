import { ConfirmationDialog } from '@/components/molecules/ConfirmationDialog';
import { ITask } from '@/types/task.types';
import { TaskEditButton } from '../atoms/TaskEditButton';

interface TaskActionButtonsProps {
  task: ITask;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskActionButtons = ({ task, onEdit, onDelete }: TaskActionButtonsProps) => (
  <div
    className="absolute right-0 top-1.5 flex items-center gap-1 bg-background ps-1 opacity-0 shadow-[-10px_0_5px_hsl(var(--background))] group-hover/card:opacity-100 focus-within:opacity-100 max-md:opacity-100"
    role="group"
    aria-label="Task actions">
    {!task.completed && <TaskEditButton onEdit={onEdit} />}
    <ConfirmationDialog
      selectedItem={task}
      itemType="task"
      onDelete={onDelete}
    />
  </div>
);
