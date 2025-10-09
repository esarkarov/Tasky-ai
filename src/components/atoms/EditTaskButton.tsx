import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit } from 'lucide-react';

interface TaskEditButtonProps {
  onEdit: () => void;
}

export const EditTaskButton = ({ onEdit }: TaskEditButtonProps) => {
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
