import { getCompletedTasks, ITasksResponse } from '@/services/taskService';
import type { LoaderFunction } from 'react-router';

export interface ICompletedLoaderData {
  tasks: ITasksResponse;
}

export const completedLoader: LoaderFunction = async (): Promise<ICompletedLoaderData> => {
  const tasks = await getCompletedTasks();

  return { tasks };
};
