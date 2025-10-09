import { ToastAction } from '@/components/ui/toast';
import { TASK_TOAST_CONTENTS } from '@/constants/contents';
import { HTTP_METHODS } from '@/constants/http';
import { ROUTES } from '@/constants/routes';
import { TIMING } from '@/constants/timing';
import { useToast } from '@/hooks/use-toast';
import { truncateString } from '@/lib/utils';
import { UseTaskOperationsParams, UseTaskOperationsResult } from '@/types/hook.types';
import { TaskFormData } from '@/types/task.types';
import { useCallback } from 'react';
import { useFetcher } from 'react-router';

export const useTaskOperations = (params: UseTaskOperationsParams = {}): UseTaskOperationsResult => {
  const { onSuccess, enableUndo = true } = params;
  const { toast } = useToast();
  const fetcher = useFetcher();

  const showToast = useCallback(
    (message: string, duration = Infinity) => {
      return toast({ title: message, duration });
    },
    [toast]
  );

  const getSuccessDescription = useCallback((content: string, baseMessage: string): string => {
    const truncatedContent = truncateString(content, 50);
    return `${baseMessage} "${truncatedContent}"`;
  }, []);

  const createTask = useCallback(
    async (formData: TaskFormData): Promise<void> => {
      if (!formData) return;

      const { id, update } = showToast(TASK_TOAST_CONTENTS.CREATE.LOADING);

      try {
        await fetcher.submit(JSON.stringify(formData), {
          action: ROUTES.APP,
          method: HTTP_METHODS.POST,
          encType: 'application/json',
        });
        onSuccess?.();

        update({
          id,
          title: TASK_TOAST_CONTENTS.CREATE.SUCCESS,
          description: getSuccessDescription(formData.content, 'Task created:'),
          duration: TIMING.TOAST_DURATION,
        });
      } catch {
        update({
          id,
          title: TASK_TOAST_CONTENTS.CREATE.ERROR,
          description: TASK_TOAST_CONTENTS.CREATE.ERROR_DESC,
          duration: TIMING.TOAST_DURATION,
          variant: 'destructive',
        });
      }
    },
    [showToast, fetcher, onSuccess, getSuccessDescription]
  );

  const updateTask = useCallback(
    async (formData: TaskFormData, taskId?: string): Promise<void> => {
      if (!taskId && !formData.id) return;

      const { id, update } = showToast(TASK_TOAST_CONTENTS.UPDATE.LOADING);

      try {
        await fetcher.submit(
          JSON.stringify({
            ...formData,
            id: taskId || formData.id,
          }),
          {
            action: ROUTES.APP,
            method: HTTP_METHODS.PUT,
            encType: 'application/json',
          }
        );
        onSuccess?.();

        update({
          id,
          title: TASK_TOAST_CONTENTS.UPDATE.SUCCESS,
          description: getSuccessDescription(formData.content, 'Task updated:'),
          duration: TIMING.TOAST_DURATION,
        });
      } catch {
        update({
          id,
          title: TASK_TOAST_CONTENTS.UPDATE.ERROR,
          description: TASK_TOAST_CONTENTS.UPDATE.ERROR_DESC,
          duration: TIMING.TOAST_DURATION,
          variant: 'destructive',
        });
      }
    },
    [showToast, fetcher, onSuccess, getSuccessDescription]
  );

  const toggleTaskComplete = useCallback(
    async (taskId: string, completed: boolean): Promise<void> => {
      if (!taskId) return;

      try {
        await fetcher.submit(JSON.stringify({ id: taskId, completed }), {
          action: ROUTES.APP,
          method: HTTP_METHODS.PUT,
          encType: 'application/json',
        });

        if (completed && enableUndo) {
          toast({
            title: '1 task completed',
            duration: TIMING.TOAST_DURATION,
            action: (
              <ToastAction
                altText="Undo task completion"
                onClick={() => toggleTaskComplete(taskId, false)}>
                Undo
              </ToastAction>
            ),
          });
        } else {
          toast({
            title: completed ? TASK_TOAST_CONTENTS.COMPLETE.SUCCESS : TASK_TOAST_CONTENTS.COMPLETE.UNCOMPLETE,
            duration: TIMING.TOAST_DURATION,
          });
        }
      } catch {
        toast({
          title: TASK_TOAST_CONTENTS.COMPLETE.ERROR,
          description: TASK_TOAST_CONTENTS.COMPLETE.ERROR_DESC,
          duration: TIMING.TOAST_DURATION,
          variant: 'destructive',
        });
      }
    },
    [enableUndo, fetcher, toast]
  );

  const deleteTask = useCallback(
    async (taskId: string): Promise<void> => {
      if (!taskId) return;

      const { id, update } = showToast(TASK_TOAST_CONTENTS.DELETE.LOADING);

      try {
        await fetcher.submit(JSON.stringify({ id: taskId }), {
          action: ROUTES.APP,
          method: HTTP_METHODS.DELETE,
          encType: 'application/json',
        });

        update({
          id,
          title: TASK_TOAST_CONTENTS.DELETE.SUCCESS,
          description: TASK_TOAST_CONTENTS.DELETE.SUCCESS_DESC,
          duration: TIMING.TOAST_DURATION,
        });
      } catch {
        update({
          id,
          title: TASK_TOAST_CONTENTS.DELETE.ERROR,
          description: TASK_TOAST_CONTENTS.DELETE.ERROR_DESC,
          duration: TIMING.TOAST_DURATION,
          variant: 'destructive',
        });
      }
    },
    [fetcher, showToast]
  );

  return {
    createTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    fetcher,
  };
};
