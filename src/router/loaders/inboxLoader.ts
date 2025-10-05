import { getInboxTasks } from '@/services/taskService';
import { ITasksLoaderData } from '@/types/loader.types';
import type { LoaderFunction } from 'react-router';

export const inboxLoader: LoaderFunction = async (): Promise<ITasksLoaderData> => {
  const tasks = await getInboxTasks();

  return { tasks };
};
