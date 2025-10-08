import { TOAST_CONTENTS } from '@/constants/contents';
import { HTTP_METHODS } from '@/constants/http';
import { ROUTES } from '@/constants/routes';
import { TIMING } from '@/constants/timing';
import { MAX_TRUNCATE_LENGTH } from '@/constants/validation';
import { useToast } from '@/hooks/use-toast';
import { truncateString } from '@/lib/utils';
import { IUseProjectOperationsParams, IUseProjectOperationsResult } from '@/types/hook.types';
import { IProjectFormData } from '@/types/project.types';
import { useCallback, useMemo } from 'react';
import { useFetcher, useLocation, useNavigate } from 'react-router';

export const useProjectOperations = (params: IUseProjectOperationsParams = {}): IUseProjectOperationsResult => {
  const { method = HTTP_METHODS.POST, projectData, onSuccess } = params;
  const fetcher = useFetcher();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isCreateOperation = useMemo(() => method === HTTP_METHODS.POST, [method]);

  const operationMessages = useMemo(
    () => (isCreateOperation ? TOAST_CONTENTS.CREATE : TOAST_CONTENTS.UPDATE),
    [isCreateOperation]
  );

  const showToast = useCallback(
    (message: string, duration = Infinity) => {
      return toast({ title: message, duration });
    },
    [toast]
  );

  const getSuccessDescription = useCallback(
    (projectName: string, hasAiGen: boolean): string => {
      const truncatedName = truncateString(projectName, MAX_TRUNCATE_LENGTH);
      const aiTaskInfo = hasAiGen ? ' and its tasks' : '';
      const action = isCreateOperation ? 'created' : 'updated';
      return `The project ${truncatedName}${aiTaskInfo} ${hasAiGen ? 'have' : 'has'} been successfully ${action}.`;
    },
    [isCreateOperation]
  );

  const saveProject = useCallback(
    async (data: IProjectFormData): Promise<void> => {
      const { id, update } = showToast(operationMessages.LOADING);

      try {
        await fetcher.submit(JSON.stringify(data), {
          action: ROUTES.PROJECTS,
          method,
          encType: 'application/json',
        });

        update({
          id,
          title: operationMessages.SUCCESS,
          description: getSuccessDescription(data.name, data.ai_task_gen ?? false),
          duration: TIMING.TOAST_DURATION,
        });

        onSuccess?.();
      } catch {
        update({
          id,
          title: operationMessages.ERROR,
          description: operationMessages.ERROR_DESC,
          duration: TIMING.TOAST_DURATION,
        });
      }
    },
    [fetcher, method, operationMessages, showToast, getSuccessDescription, onSuccess]
  );

  const deleteProject = useCallback(async (): Promise<void> => {
    if (!projectData) return;

    const isViewingProject = location.pathname === ROUTES.PROJECT(projectData.id as string);
    if (isViewingProject) {
      navigate(ROUTES.INBOX);
    }

    const { id, update } = showToast(TOAST_CONTENTS.DELETE.LOADING);

    try {
      await fetcher.submit(JSON.stringify(projectData), {
        action: ROUTES.PROJECTS,
        method: HTTP_METHODS.DELETE,
        encType: 'application/json',
      });

      update({
        id,
        title: TOAST_CONTENTS.DELETE.SUCCESS,
        description: `The project ${truncateString(projectData.name, MAX_TRUNCATE_LENGTH)} has been successfully deleted.`,
        duration: TIMING.TOAST_DURATION,
      });

      onSuccess?.();
    } catch {
      update({
        id,
        title: TOAST_CONTENTS.DELETE.ERROR,
        description: TOAST_CONTENTS.DELETE.ERROR_DESC,
        duration: TIMING.TOAST_DURATION,
      });
    }
  }, [fetcher, location.pathname, navigate, projectData, showToast, onSuccess]);

  return {
    saveProject,
    deleteProject,
    fetcher,
  };
};
