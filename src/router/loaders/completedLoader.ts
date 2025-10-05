import { getCompletedTasks } from '@/services/taskService';
import { ITasksLoaderData } from '@/types/loader.types';
import type { LoaderFunction } from 'react-router';

export const completedLoader: LoaderFunction = async (): Promise<ITasksLoaderData> => {
  const tasks = await getCompletedTasks();

  return { tasks };
};
