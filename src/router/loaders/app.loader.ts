import { ROUTES } from '@/constants/routes';
import { getUserId } from '@/lib/utils';
import { projectService } from '@/services/project.service';
import { getTaskCounts } from '@/services/task.services';
import type { LoaderFunction } from 'react-router';
import { redirect } from 'react-router';

export const appLoader: LoaderFunction = async () => {
  const userId = getUserId();

  if (!userId) return redirect(ROUTES.LOGIN);

  const [projects, taskCounts] = await Promise.all([projectService.getRecentProjects(), getTaskCounts()]);

  return { projects, taskCounts };
};
