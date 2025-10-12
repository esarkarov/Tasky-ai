import { PROJECT_TOAST_CONTENTS } from '@/constants/ui-contents';
import { HTTP_METHODS } from '@/constants/http-methods';
import { ROUTES } from '@/constants/routes';
import { TIMING } from '@/constants/timing';
import { MAX_TRUNCATE_LENGTH } from '@/constants/validation';
import { useToast } from '@/hooks/use-toast';
import { truncateString } from '@/lib/utils';
import { SearchStatus } from '@/types/shared.types';
import { UseProjectOperationsParams, UseProjectOperationsResult } from '@/types/hooks.types';
import { ProjectFormData } from '@/types/projects.types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFetcher, useLocation, useNavigate, useNavigation } from 'react-router';
import { buildProjectSuccessDescription, buildSearchUrl, executeWithToast } from '@/utils/operation.utils';

export const useProjectOperations = (params: UseProjectOperationsParams = {}): UseProjectOperationsResult => {
  const { method = 'POST', projectData, onSuccess } = params;

  const { toast } = useToast();
  const { pathname } = useLocation();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { state, location } = useNavigation();

  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isFormBusy = fetcher.state !== 'idle';
  const isViewingCurrentProject = pathname === ROUTES.PROJECT(projectData?.id as string);
  const isNavigatingToProjects = state === 'loading' && location?.pathname === ROUTES.PROJECTS;

  const operationMessages = useMemo(
    () => (method === 'POST' ? PROJECT_TOAST_CONTENTS.CREATE : PROJECT_TOAST_CONTENTS.UPDATE),
    [method]
  );

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const saveProject = useCallback(
    async (formData: ProjectFormData): Promise<void> => {
      if (!formData) return;

      const operation = () =>
        fetcher.submit(JSON.stringify(formData), {
          action: ROUTES.PROJECTS,
          method,
          encType: 'application/json',
        });

      const description = buildProjectSuccessDescription(formData.name, formData.ai_task_gen, method);

      await executeWithToast(operation, toast, operationMessages, description, onSuccess);
    },
    [fetcher, method, operationMessages, toast, onSuccess]
  );

  const deleteProject = useCallback(async (): Promise<void> => {
    if (!projectData) return;

    if (isViewingCurrentProject) {
      navigate(ROUTES.INBOX);
    }

    const operation = () =>
      fetcher.submit(JSON.stringify(projectData), {
        action: ROUTES.PROJECTS,
        method: HTTP_METHODS.DELETE,
        encType: 'application/json',
      });

    const description = `The project ${truncateString(projectData.name, MAX_TRUNCATE_LENGTH)} has been successfully deleted.`;

    await executeWithToast(operation, toast, PROJECT_TOAST_CONTENTS.DELETE, description, onSuccess);
  }, [projectData, isViewingCurrentProject, navigate, fetcher, toast, onSuccess]);

  const searchProjects = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      const searchValue = e.target.value.trim();
      setSearchStatus('loading');

      searchTimeoutRef.current = setTimeout(() => {
        setSearchStatus('searching');
        navigate(buildSearchUrl(ROUTES.PROJECTS, searchValue));
        setTimeout(() => setSearchStatus('idle'), 100);
      }, TIMING.DELAY_DURATION);
    },
    [navigate]
  );

  return {
    saveProject,
    deleteProject,
    searchProjects,
    fetcher,
    formState: isFormBusy,
    searchStatus: isNavigatingToProjects ? 'searching' : searchStatus,
  };
};
