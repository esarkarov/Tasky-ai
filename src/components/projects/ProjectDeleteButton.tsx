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
import { useToast } from '@/hooks/use-toast';
import { IProject } from '@/interfaces';
import { truncateString } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { useFetcher, useLocation, useNavigate } from 'react-router';

interface ProjectDeleteButtonProps {
  defaultFormData: IProject;
}

export const ProjectDeleteButton = ({ defaultFormData }: ProjectDeleteButtonProps) => {
  const fetcher = useFetcher();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProjectDelete = useCallback(async () => {
    if (location.pathname === `/app/projects/${defaultFormData.id}`) {
      navigate('/app/inbox');
    }

    const { id, update } = toast({
      title: 'Deleting project...',
      duration: Infinity,
    });

    try {
      await fetcher.submit(JSON.stringify(defaultFormData), {
        action: '/app/projects',
        method: 'DELETE',
        encType: 'application/json',
      });

      update({
        id,
        title: 'Project deleted',
        description: `The project ${truncateString(defaultFormData.name, 32)} has been successfully deleted.`,
        duration: 5000,
      });
    } catch (err) {
      console.log('Error deleting project: ', err);
      update({
        id,
        title: 'Error deleting project',
        description: `An error occurred while deleting the project.`,
        duration: 5000,
      });
    }
  }, [defaultFormData, fetcher, location.pathname, navigate, toast]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start px-2 !text-destructive">
          <Trash2 /> Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>

          <AlertDialogDescription>
            The <strong>{truncateString(defaultFormData.name, 48)}</strong> project and all of its
            tasks will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleProjectDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
