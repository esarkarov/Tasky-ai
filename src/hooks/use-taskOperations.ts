import { HTTP_METHODS } from '@/constants/http';
import { ROUTES } from '@/constants/routes';
import { ITaskFormData } from '@/types/task.types';
import { useCallback } from 'react';
import { useFetcher } from 'react-router';

interface UseTaskOperationsParams {
  onSuccess?: () => void;
}

export const useTaskOperations = (options?: UseTaskOperationsParams) => {
  const fetcher = useFetcher();

  const createTask = useCallback(
    async (formData: ITaskFormData) => {
      await fetcher.submit(JSON.stringify(formData), {
        action: ROUTES.APP,
        method: HTTP_METHODS.POST,
        encType: 'application/json',
      });
      options?.onSuccess?.();
    },
    [fetcher, options]
  );

  const updateTask = useCallback(
    async (formData: ITaskFormData, taskId?: string) => {
      await fetcher.submit(
        JSON.stringify({
          ...formData,
          id: taskId,
        }),
        {
          action: ROUTES.APP,
          method: HTTP_METHODS.PUT,
          encType: 'application/json',
        }
      );
      options?.onSuccess?.();
    },
    [fetcher, options]
  );

  const toggleTaskComplete = useCallback(
    async (taskId: string, completed: boolean) => {
      await fetcher.submit(JSON.stringify({ id: taskId, completed }), {
        action: ROUTES.APP,
        method: HTTP_METHODS.PUT,
        encType: 'application/json',
      });
    },
    [fetcher]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      await fetcher.submit(JSON.stringify({ id: taskId }), {
        action: ROUTES.APP,
        method: HTTP_METHODS.DELETE,
        encType: 'application/json',
      });
    },
    [fetcher]
  );

  return {
    createTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    fetcher,
  };
};
