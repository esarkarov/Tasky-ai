import { taskService } from '@/services/task/task.service';
import { TasksLoaderData } from '@/types/loaders.types';
import type { LoaderFunction } from 'react-router';

export const tasksCompletedLoader: LoaderFunction = async (): Promise<TasksLoaderData> => {
  const tasks = await taskService.getCompletedTasks();

  return { tasks };
};
