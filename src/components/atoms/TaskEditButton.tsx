import { Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface TaskEditButtonProps {
  onEdit: () => void;
}

export const TaskEditButton = ({ onEdit }: TaskEditButtonProps) => {
  return (
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
  );
};
