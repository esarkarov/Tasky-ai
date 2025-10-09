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
import { truncateString } from '@/lib/utils';
import { EntityType } from '@/types/common.types';
import { ProjectBase } from '@/types/project.types';
import { Task } from '@/types/task.types';
import { Trash2 } from 'lucide-react';

interface ConfirmationDialogProps {
  selectedItem: Task | ProjectBase;
  entityType: EntityType;
  onDelete: (taskId: string) => Promise<void>;
}

export const ConfirmationDialog = ({ selectedItem, onDelete, entityType }: ConfirmationDialogProps) => {
  const isTask = entityType === 'task';
  const itemLabel = 'content' in selectedItem ? selectedItem.content : selectedItem.name;

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            {isTask ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground"
                aria-label="Delete task">
                <Trash2 aria-hidden="true" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start px-2 !text-destructive"
                aria-label="Delete project">
                <Trash2 aria-hidden="true" /> <span>Delete</span>
              </Button>
            )}
          </AlertDialogTrigger>
        </TooltipTrigger>
        {isTask && <TooltipContent>Delete task</TooltipContent>}
      </Tooltip>

      <AlertDialogContent
        role="alertdialog"
        aria-describedby="delete-description">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {isTask ? 'task' : 'project'}?</AlertDialogTitle>
          <AlertDialogDescription id="delete-description">
            The <strong>{truncateString(itemLabel, 48)}</strong> {isTask ? 'task' : 'project'} will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel aria-label="Cancel deletion">Cancel</AlertDialogCancel>
          <AlertDialogAction
            aria-label={`Confirm delete ${isTask ? 'task' : 'project'}`}
            onClick={() => onDelete(selectedItem.id as string)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
