import { PROJECT_TOAST_CONTENTS } from '@/constants/contents';
import { HTTP_METHODS } from '@/constants/http';
import { ROUTES } from '@/constants/routes';
import { TIMING } from '@/constants/timing';
import { MAX_TRUNCATE_LENGTH } from '@/constants/validation';
import { useToast } from '@/hooks/use-toast';
import { truncateString } from '@/lib/utils';
import { SearchStatus } from '@/types/common.types';
import { UseProjectOperationsParams, UseProjectOperationsResult } from '@/types/hook.types';
import { ProjectFormData } from '@/types/project.types';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useFetcher, useLocation, useNavigate } from 'react-router';

export const useProjectOperations = (params: UseProjectOperationsParams = {}): UseProjectOperationsResult => {
  const { method = 'POST', projectData, onSuccess } = params;

  const { toast } = useToast();
  const { pathname } = useLocation();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [searchStatus, setSearchState] = useState<SearchStatus>('idle');
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const isViewingProject = pathname === ROUTES.PROJECT(projectData?.id as string);

  const operationMessages = useMemo(
    () => (method === 'POST' ? PROJECT_TOAST_CONTENTS.CREATE : PROJECT_TOAST_CONTENTS.UPDATE),
    [method]
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
      const action = method === 'POST' ? 'created' : 'updated';
      return `The project ${truncatedName}${aiTaskInfo} ${hasAiGen ? 'have' : 'has'} been successfully ${action}.`;
    },
    [method]
  );

  const saveProject = useCallback(
    async (formData: ProjectFormData): Promise<void> => {
      if (!formData) return;

      const { id, update } = showToast(operationMessages.LOADING);

      try {
        await fetcher.submit(JSON.stringify(formData), {
          action: ROUTES.PROJECTS,
          method,
          encType: 'application/json',
        });

        update({
          id,
          title: operationMessages.SUCCESS,
          description: getSuccessDescription(formData.name, formData.ai_task_gen ?? false),
          duration: TIMING.TOAST_DURATION,
        });

        onSuccess?.();
      } catch {
        update({
          id,
          title: operationMessages.ERROR,
          description: operationMessages.ERROR_DESC,
          duration: TIMING.TOAST_DURATION,
          variant: 'destructive',
        });
      }
    },
    [fetcher, method, operationMessages, showToast, getSuccessDescription, onSuccess]
  );

  const deleteProject = useCallback(async (): Promise<void> => {
    if (!projectData) return;

    if (isViewingProject) {
      navigate(ROUTES.INBOX);
    }

    const { id, update } = showToast(PROJECT_TOAST_CONTENTS.DELETE.LOADING);

    try {
      await fetcher.submit(JSON.stringify(projectData), {
        action: ROUTES.PROJECTS,
        method: HTTP_METHODS.DELETE,
        encType: 'application/json',
      });

      update({
        id,
        title: PROJECT_TOAST_CONTENTS.DELETE.SUCCESS,
        description: `The project ${truncateString(projectData.name, MAX_TRUNCATE_LENGTH)} has been successfully deleted.`,
        duration: TIMING.TOAST_DURATION,
      });

      onSuccess?.();
    } catch {
      update({
        id,
        title: PROJECT_TOAST_CONTENTS.DELETE.ERROR,
        description: PROJECT_TOAST_CONTENTS.DELETE.ERROR_DESC,
        duration: TIMING.TOAST_DURATION,
        variant: 'destructive',
      });
    }
  }, [projectData, isViewingProject, showToast, navigate, fetcher, onSuccess]);

  const searchProjects = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      const submitTarget = e.currentTarget.form;

      searchTimeout.current = setTimeout(async () => {
        setSearchState('searching');
        await fetcher.submit(submitTarget);
        setSearchState('idle');
      }, TIMING.DELAY_DURATION);

      setSearchState('loading');
    },
    [fetcher]
  );

  return {
    saveProject,
    deleteProject,
    searchProjects,
    searchStatus,
    fetcher,
  };
};
