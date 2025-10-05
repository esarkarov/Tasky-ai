import { getTodayTasks, ITasksResponse } from '@/services/taskService';
import type { LoaderFunction } from 'react-router';

export interface ITodayLoaderData {
  tasks: ITasksResponse;
}

export const todayLoader: LoaderFunction = async (): Promise<ITodayLoaderData> => {
  const tasks = await getTodayTasks();

  return { tasks };
};
