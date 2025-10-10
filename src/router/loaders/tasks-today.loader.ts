import { getTodayTasks } from '@/services/task.services';
import { TasksLoaderData } from '@/types/loaders.types';
import type { LoaderFunction } from 'react-router';

export const tasksTodayLoader: LoaderFunction = async (): Promise<TasksLoaderData> => {
  const tasks = await getTodayTasks();

  return { tasks };
};
