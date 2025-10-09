import { getCompletedTasks } from '@/services/taskService';
import { TasksLoaderData } from '@/types/loader.types';
import type { LoaderFunction } from 'react-router';

export const completedLoader: LoaderFunction = async (): Promise<TasksLoaderData> => {
  const tasks = await getCompletedTasks();

  return { tasks };
};
