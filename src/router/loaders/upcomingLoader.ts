import { getUpcomingTasks, ITasksResponse } from '@/services/taskService';
import type { LoaderFunction } from 'react-router';

export interface IUpcomingLoaderData {
  tasks: ITasksResponse;
}

export const upcomingLoader: LoaderFunction = async (): Promise<IUpcomingLoaderData> => {
  const tasks = await getUpcomingTasks();

  return { tasks };
};
