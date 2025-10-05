import { ROUTES } from '@/constants/routes';
import { getUserId } from '@/lib/utils';
import { getRecentProjects } from '@/services/projectService';
import { getTaskCounts } from '@/services/taskService';
import type { LoaderFunction } from 'react-router';
import { redirect } from 'react-router';

export const appLoader: LoaderFunction = async () => {
  const userId = getUserId();

  if (!userId) return redirect(ROUTES.LOGIN);

  const [projects, taskCounts] = await Promise.all([getRecentProjects(), getTaskCounts()]);

  return { projects, taskCounts };
};
