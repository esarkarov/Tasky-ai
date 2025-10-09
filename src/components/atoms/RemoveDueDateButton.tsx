import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { X } from 'lucide-react';

interface RemoveDueDateButtonProps {
  onDateRemove: () => void;
}
export const RemoveDueDateButton = ({ onDateRemove }: RemoveDueDateButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="px-2 -ms-2"
          aria-label="Remove due date"
          onClick={onDateRemove}>
          <X aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Remove due date</TooltipContent>
    </Tooltip>
  );
};
