import { env } from '@/config/env.config';
import { databases } from '@/lib/appwrite';
import { taskQueries } from '@/queries/task/task.queries';
import { TaskEntity, TaskCreateInput, TasksResponse, TaskUpdateInput } from '@/types/tasks.types';
import { generateID } from '@/utils/text/text.utils';

export const taskRepository = {
  getTodayCountByUserId: async (todayDate: string, tomorrowDate: string, userId: string): Promise<number> => {
    const { total } = await databases.listDocuments<TaskEntity>(
      env.appwriteDatabaseId,
      env.appwriteTasksCollectionId,
      taskQueries.todayCount(todayDate, tomorrowDate, userId)
    );

    return total;
  },

  getInboxCountByUserId: async (userId: string): Promise<number> => {
    const { total } = await databases.listDocuments<TaskEntity>(
      env.appwriteDatabaseId,
      env.appwriteTasksCollectionId,
      taskQueries.inboxCount(userId)
    );

    return total;
  },

  getCompleted: (userId: string): Promise<TasksResponse> =>
    databases.listDocuments<TaskEntity>(
      env.appwriteDatabaseId,
      env.appwriteTasksCollectionId,
      taskQueries.completedTasks(userId)
    ),

  getInbox: (userId: string): Promise<TasksResponse> =>
    databases.listDocuments<TaskEntity>(
      env.appwriteDatabaseId,
      env.appwriteTasksCollectionId,
      taskQueries.inboxTasks(userId)
    ),

  getToday: (todayDate: string, tomorrowDate: string, userId: string): Promise<TasksResponse> =>
    databases.listDocuments<TaskEntity>(
      env.appwriteDatabaseId,
      env.appwriteTasksCollectionId,
      taskQueries.todayTasks(todayDate, tomorrowDate, userId)
    ),

  getUpcoming: (todayDate: string, userId: string): Promise<TasksResponse> =>
    databases.listDocuments<TaskEntity>(
      env.appwriteDatabaseId,
      env.appwriteTasksCollectionId,
      taskQueries.upcomingTasks(todayDate, userId)
    ),

  createMany: (tasks: Array<TaskCreateInput & { id?: string }>): Promise<TaskEntity[]> =>
    Promise.all(
      tasks.map((task) => {
        const { id, ...data } = task;
        const docId = id ?? generateID();
        return taskRepository.create(docId, data as TaskCreateInput);
      })
    ),

  create: (id: string, data: TaskCreateInput): Promise<TaskEntity> =>
    databases.createDocument<TaskEntity>(env.appwriteDatabaseId, env.appwriteTasksCollectionId, id, data),

  update: (id: string, data: TaskUpdateInput): Promise<TaskEntity> =>
    databases.updateDocument<TaskEntity>(env.appwriteDatabaseId, env.appwriteTasksCollectionId, id, data),

  delete: (id: string) => databases.deleteDocument(env.appwriteDatabaseId, env.appwriteTasksCollectionId, id),
};
