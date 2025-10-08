import { HTTP_METHODS } from '@/constants/http';
import { ROUTES } from '@/constants/routes';
import { TIMING } from '@/constants/timing';
import { truncateString } from '@/lib/utils';
import { useCallback } from 'react';
import { useFetcher, useLocation, useNavigate } from 'react-router';
import { useToast } from '@/hooks/use-toast';
import { IProjectBase, IProjectFormData } from '@/types/project.types';
import { THttpMethod } from '@/types';

interface UseProjectOperationsParams {
  onSuccess: () => void;
  projectData: IProjectBase;
  method: THttpMethod;
}
type PartialUseProjectOperationsParams = Partial<UseProjectOperationsParams>;

export const useProjectOperations = (options?: PartialUseProjectOperationsParams) => {
  const fetcher = useFetcher();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const saveProject = useCallback(
    async (data: IProjectFormData) => {
      options?.onSuccess?.();

      const { id, update } = toast({
        title: `${options?.method === 'POST' ? 'Creating' : 'Updating'} project...`,
        duration: Infinity,
      });

      try {
        await fetcher.submit(JSON.stringify(data), {
          action: ROUTES.PROJECTS,
          method: options?.method,
          encType: 'application/json',
        });

        update({
          id,
          title: `Project ${options?.method === 'POST' ? 'created' : 'updated'}.`,
          description: `The project ${truncateString(data.name, 32)} ${data.ai_task_gen ? 'and its tasks' : ''} have been successfully ${options?.method === 'POST' ? 'created' : 'updated'}.`,
          duration: TIMING.TOAST_DURATION,
        });
      } catch {
        update({
          id,
          title: 'Error creating project',
          description: 'An error occurred while creating the project.',
          duration: TIMING.TOAST_DURATION,
        });
      }
    },
    [fetcher, options, toast]
  );

  const deleteProject = useCallback(async () => {
    if (location.pathname === ROUTES.PROJECT(options?.projectData?.id as string)) {
      navigate(ROUTES.INBOX);
    }

    const { id, update } = toast({
      title: 'Deleting project...',
      duration: Infinity,
    });

    try {
      await fetcher.submit(JSON.stringify(options?.projectData), {
        action: ROUTES.PROJECTS,
        method: HTTP_METHODS.DELETE,
        encType: 'application/json',
      });

      update({
        id,
        title: 'Project deleted',
        description: `The project ${truncateString(options?.projectData?.name as string, 32)} has been successfully deleted.`,
        duration: TIMING.TOAST_DURATION,
      });
    } catch {
      update({
        id,
        title: 'Error deleting project',
        description: `An error occurred while deleting the project.`,
        duration: TIMING.TOAST_DURATION,
      });
    }
  }, [fetcher, location.pathname, navigate, options, toast]);

  return {
    saveProject,
    deleteProject,
    fetcher,
    isSubmitting: fetcher.state === 'submitting',
    isLoading: fetcher.state === 'loading',
  };
};
