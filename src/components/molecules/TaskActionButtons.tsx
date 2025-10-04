import { ConfirmationDialog } from '@/components/molecules/ConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ITask } from '@/interfaces';
import { Edit } from 'lucide-react';

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
    {!task.completed && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground"
            aria-label="Edit task"
            onClick={onEdit}>
            <Edit aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit task</TooltipContent>
      </Tooltip>
    )}

    <ConfirmationDialog
      selectedItem={task}
      itemType="task"
      onDelete={onDelete}
    />
  </div>
);
