import { ROUTES } from '@/constants/routes';
import { projectService } from '@/services/project/project.service';
import { taskService } from '@/services/task/task.service';
import { getUserId } from '@/utils/auth/auth.utils';
import type { LoaderFunction } from 'react-router';
import { redirect } from 'react-router';

export const appLoader: LoaderFunction = async () => {
  const userId = getUserId();

  if (!userId) return redirect(ROUTES.LOGIN);

  const [projects, taskCounts] = await Promise.all([projectService.getRecentProjects(), taskService.getTaskCounts()]);

  return { projects, taskCounts };
};
