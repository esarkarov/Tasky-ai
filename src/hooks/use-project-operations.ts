import { HTTP_METHODS } from '@/constants/http-methods';
import { ROUTES } from '@/constants/routes';
import { TIMING } from '@/constants/timing';
import { PROJECT_TOAST_CONTENTS } from '@/constants/ui-contents';
import { MAX_TRUNCATE_LENGTH } from '@/constants/validation';
import { useToast } from '@/hooks/use-toast';
import { UseProjectOperationsParams, UseProjectOperationsResult } from '@/types/hooks.types';
import { ProjectFormInput } from '@/types/projects.types';
import { SearchStatus } from '@/types/shared.types';
import { buildProjectSuccessDescription, buildSearchUrl, executeWithToast } from '@/utils/operation/operation.utils';
import { truncateString } from '@/utils/text/text.utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFetcher, useLocation, useNavigate, useNavigation } from 'react-router';

export const useProjectOperations = ({
  method = 'POST',
  projectData,
  onSuccess,
}: UseProjectOperationsParams = {}): UseProjectOperationsResult => {
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { state, location } = useNavigation();
  const { pathname } = useLocation();
  const { toast } = useToast();
  const fetcher = useFetcher();
  const navigate = useNavigate();

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
    async (formData: ProjectFormInput): Promise<void> => {
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
