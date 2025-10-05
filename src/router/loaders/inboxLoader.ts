import { getInboxTasks, ITasksResponse } from '@/services/taskService';
import type { LoaderFunction } from 'react-router';

export interface IInboxLoaderData {
  tasks: ITasksResponse;
}

export const inboxLoader: LoaderFunction = async (): Promise<IInboxLoaderData> => {
  const tasks = await getInboxTasks();

  return { tasks };
};
