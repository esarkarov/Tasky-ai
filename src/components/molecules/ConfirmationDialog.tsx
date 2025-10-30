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
import { TriggerVariant } from '@/types/shared.types';
import { truncateString } from '@/utils/text/text.utils';
import { Loader2, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

interface ConfirmationDialogProps {
  id: string;
  label: string;
  title: string;
  variant: TriggerVariant;
  handleDelete: (id: string) => Promise<void>;
  disabled?: boolean;
}

export const ConfirmationDialog = ({
  id,
  label,
  handleDelete,
  variant,
  disabled = false,
  title,
}: ConfirmationDialogProps) => {
  const { formState } = useTaskOperations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const isIconVariant = variant === 'icon';
  const isPending = isDeleting || formState;
  const description = `The '${truncateString(label, 48)}' will be permanently deleted.`;

  const handleClick = useCallback(async () => {
    if (!isPending) {
      setIsDeleting(true);
      try {
        await handleDelete(id);
        setOpen(false);
      } finally {
        setIsDeleting(false);
      }
    }
  }, [isPending, handleDelete, id]);

  const trigger = isIconVariant ? (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 text-muted-foreground"
      aria-label="Delete"
      disabled={disabled || isDeleting}>
      <Trash2 aria-hidden="true" />
    </Button>
  ) : (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start px-2 !text-destructive"
      aria-label="Delete"
      disabled={disabled || isDeleting}>
      <Trash2 aria-hidden="true" /> <span>Delete</span>
    </Button>
  );

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        </TooltipTrigger>
        {isIconVariant && <TooltipContent>Delete task</TooltipContent>}
      </Tooltip>

      <AlertDialogContent
        role="alertdialog"
        aria-describedby="delete-description"
        aria-busy={isPending}
        className={isPending ? 'opacity-60 pointer-events-none transition-opacity' : ''}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription id="delete-description">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            aria-label="Cancel deletion"
            disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            aria-label="Confirm deletion"
            onClick={handleClick}
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
