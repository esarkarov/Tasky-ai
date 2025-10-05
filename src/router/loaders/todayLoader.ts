import { getTodayTasks } from '@/services/taskService';
import { ITasksLoaderData } from '@/types/loader.types';
import type { LoaderFunction } from 'react-router';

export const todayLoader: LoaderFunction = async (): Promise<ITasksLoaderData> => {
  const tasks = await getTodayTasks();

  return { tasks };
};
