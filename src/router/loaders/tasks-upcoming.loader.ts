import { getUpcomingTasks } from '@/services/task.services';
import { TasksLoaderData } from '@/types/loaders.types';
import type { LoaderFunction } from 'react-router';

export const tasksUpcomingLoader: LoaderFunction = async (): Promise<TasksLoaderData> => {
  const tasks = await getUpcomingTasks();

  return { tasks };
};
