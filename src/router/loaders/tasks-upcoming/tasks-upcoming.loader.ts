import { projectService } from '@/services/project/project.service';
import { taskService } from '@/services/task/task.service';
import type { LoaderFunction } from 'react-router';

export const tasksUpcomingLoader: LoaderFunction = async () => {
  const [projects, tasks] = await Promise.all([projectService.getRecentProjects(), taskService.getUpcomingTasks()]);

  return { tasks, projects };
};
