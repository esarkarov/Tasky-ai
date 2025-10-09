import { getUpcomingTasks } from '@/services/taskService';
import { TasksLoaderData } from '@/types/loader.types';
import type { LoaderFunction } from 'react-router';

export const upcomingLoader: LoaderFunction = async (): Promise<TasksLoaderData> => {
  const tasks = await getUpcomingTasks();

  return { tasks };
};
