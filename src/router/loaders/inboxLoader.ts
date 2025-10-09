import { getInboxTasks } from '@/services/taskService';
import { TasksLoaderData } from '@/types/loader.types';
import type { LoaderFunction } from 'react-router';

export const inboxLoader: LoaderFunction = async (): Promise<TasksLoaderData> => {
  const tasks = await getInboxTasks();

  return { tasks };
};
