import { ROUTES } from '@/constants/routes';
import { ITaskCounts } from '@/interfaces';
import { getUserId } from '@/lib/utils';
import { getRecentProjects, IProjectsListResponse } from '@/services/projectService';
import { getTaskCounts } from '@/services/taskService';
import type { LoaderFunction } from 'react-router';
import { redirect } from 'react-router';

export interface AppLoaderData {
  projects: IProjectsListResponse;
  taskCounts: ITaskCounts;
}

export const appLoader: LoaderFunction = async () => {
  const userId = getUserId();

  if (!userId) return redirect(ROUTES.LOGIN);

  const [projects, taskCounts] = await Promise.all([getRecentProjects(), getTaskCounts()]);

  return { projects, taskCounts };
};
