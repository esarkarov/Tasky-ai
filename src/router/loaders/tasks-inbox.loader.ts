import { getInboxTasks } from '@/services/task.services';
import { TasksLoaderData } from '@/types/loaders.types';
import type { LoaderFunction } from 'react-router';

export const tasksInboxLoader: LoaderFunction = async (): Promise<TasksLoaderData> => {
  const tasks = await getInboxTasks();

  return { tasks };
};
