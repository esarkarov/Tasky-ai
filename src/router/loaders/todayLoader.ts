import { getTodayTasks } from '@/services/taskService';
import { TasksLoaderData } from '@/types/loader.types';
import type { LoaderFunction } from 'react-router';

export const todayLoader: LoaderFunction = async (): Promise<TasksLoaderData> => {
  const tasks = await getTodayTasks();

  return { tasks };
};
