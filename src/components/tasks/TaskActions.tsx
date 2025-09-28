import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ITask } from '@/interfaces';
import { Edit } from 'lucide-react';

interface TaskActionsProps {
  task: ITask;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskActions = ({ task, onEdit, onDelete }: TaskActionsProps) => (
  <div className="absolute top-1.5 right-0 bg-background ps-1 shadow-[-10px_0_5px_hsl(var(--background))] flex items-center gap-1 opacity-0 group-hover/card:opacity-100 focus-within:opacity-100 max-md:opacity-100">
    {!task.completed && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-muted-foreground"
            aria-label="Edit task"
            onClick={onEdit}>
            <Edit />
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
