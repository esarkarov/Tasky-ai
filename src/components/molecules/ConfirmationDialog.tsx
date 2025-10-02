import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { IProject, ITask } from '@/interfaces';
import { truncateString } from '@/lib/utils';
import { TItemType } from '@/types';
import { Trash2 } from 'lucide-react';

interface ConfirmationDialogProps {
  selectedItem: ITask | IProject;
  itemType: TItemType;
  onDelete: () => void;
}

export const ConfirmationDialog = ({ selectedItem, onDelete, itemType }: ConfirmationDialogProps) => {
  const isTask = itemType === 'task';

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            {isTask ? (
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-muted-foreground"
                aria-label="Delete task">
                <Trash2 />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start px-2 !text-destructive">
                <Trash2 /> Delete
              </Button>
            )}
          </AlertDialogTrigger>
        </TooltipTrigger>
        {isTask && <TooltipContent>Delete task</TooltipContent>}
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {'content' in selectedItem ? 'task' : 'project'}?</AlertDialogTitle>
          <AlertDialogDescription>
            The
            <strong>
              {truncateString('content' in selectedItem ? selectedItem.content : selectedItem.name, 48)}
            </strong>{' '}
            {'content' in selectedItem ? 'task' : 'project'} will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
