import { projectService } from '@/services/project/project.service';
import { taskService } from '@/services/task/task.service';
import type { LoaderFunction } from 'react-router';

export const tasksCompletedLoader: LoaderFunction = async () => {
  const [projects, tasks] = await Promise.all([projectService.getRecentProjects(), taskService.getCompletedTasks()]);

  return { tasks, projects };
};
