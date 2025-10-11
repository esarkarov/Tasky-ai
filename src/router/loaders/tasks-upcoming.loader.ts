import { taskService } from '@/services/task.service';
import { TasksLoaderData } from '@/types/loaders.types';
import type { LoaderFunction } from 'react-router';

export const tasksUpcomingLoader: LoaderFunction = async (): Promise<TasksLoaderData> => {
  const tasks = await taskService.getUpcomingTasks();

  return { tasks };
};
