import { getCompletedTasks } from '@/services/task.services';
import { TasksLoaderData } from '@/types/loaders.types';
import type { LoaderFunction } from 'react-router';

export const tasksCompletedLoader: LoaderFunction = async (): Promise<TasksLoaderData> => {
  const tasks = await getCompletedTasks();

  return { tasks };
};
