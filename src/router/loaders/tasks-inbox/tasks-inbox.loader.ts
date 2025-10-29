import { projectService } from '@/services/project/project.service';
import { taskService } from '@/services/task/task.service';
import type { LoaderFunction } from 'react-router';

export const tasksInboxLoader: LoaderFunction = async () => {
  const [projects, tasks] = await Promise.all([projectService.getRecentProjects(), taskService.getInboxTasks()]);

  return { tasks, projects };
};
