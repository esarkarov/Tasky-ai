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
import { useTaskOperations } from '@/hooks/use-task-operations';
import { truncateString } from '@/utils/text.utils';
import { ProjectBase } from '@/types/projects.types';
import { EntityType } from '@/types/shared.types';
import { Task } from '@/types/tasks.types';
import { Loader2, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

interface ConfirmationDialogProps {
  selectedItem: Task | ProjectBase;
  entityType: EntityType;
  onDelete: (taskId: string) => Promise<void>;
}

export const ConfirmationDialog = ({ selectedItem, onDelete, entityType }: ConfirmationDialogProps) => {
  const { formState } = useTaskOperations();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const itemLabel = 'content' in selectedItem ? selectedItem.content : selectedItem.name;
  const isTask = entityType === 'task';

  const handleDelete = useCallback(async () => {
    if (onDelete && !isDeleting) {
      setIsDeleting(true);
      try {
        await onDelete(selectedItem.id as string);
        setIsOpen(false);
      } finally {
        setIsDeleting(false);
      }
    }
  }, [isDeleting, onDelete, selectedItem.id]);
  const isPending = isDeleting || formState;

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            {isTask ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground"
                aria-label="Delete task"
                disabled={isDeleting}>
                <Trash2 aria-hidden="true" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start px-2 !text-destructive"
                aria-label="Delete project"
                disabled={isDeleting}>
                <Trash2 aria-hidden="true" /> <span>Delete</span>
              </Button>
            )}
          </AlertDialogTrigger>
        </TooltipTrigger>
        {isTask && <TooltipContent>Delete task</TooltipContent>}
      </Tooltip>

      <AlertDialogContent
        role="alertdialog"
        aria-describedby="delete-description"
        aria-busy={isPending}
        className={isPending ? 'opacity-60 pointer-events-none transition-opacity' : ''}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {isTask ? 'task' : 'project'}?</AlertDialogTitle>
          <AlertDialogDescription id="delete-description">
            The <strong>{truncateString(itemLabel, 48)}</strong> {isTask ? 'task' : 'project'} will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            aria-label="Cancel deletion"
            disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            aria-label={`Confirm delete ${isTask ? 'task' : 'project'}`}
            onClick={handleDelete}
            disabled={isPending}
            className="gap-2">
            {isPending && (
              <Loader2
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
