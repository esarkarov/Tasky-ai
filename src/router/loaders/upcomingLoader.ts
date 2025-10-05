import { getUpcomingTasks } from '@/services/taskService';
import { ITasksLoaderData } from '@/types/loader.types';
import type { LoaderFunction } from 'react-router';

export const upcomingLoader: LoaderFunction = async (): Promise<ITasksLoaderData> => {
  const tasks = await getUpcomingTasks();

  return { tasks };
};
