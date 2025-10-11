import { env } from '@/config/env.config';
import { databases } from '@/lib/appwrite';
import { Task, TaskCreateData, TasksResponse, TaskUpdateData } from '@/types/tasks.types';
import { Query } from 'appwrite';

export const taskRepository = {
  getTodayCountByUserId: (todayDate: string, tomorrowDate: string, userId: string): Promise<TasksResponse> => {
    const queries = [
      Query.select(['$id']),
      Query.and([Query.greaterThanEqual('due_date', todayDate), Query.lessThan('due_date', tomorrowDate)]),
      Query.equal('completed', false),
      Query.equal('userId', userId),
      Query.limit(1),
    ];

    return databases.listDocuments<Task>(env.appwriteDatabaseId, env.appwriteTasksCollectionId, queries);
  },

  getInboxCountByUserId: (userId: string): Promise<TasksResponse> => {
    const queries = [
      Query.select(['$id']),
      Query.isNull('projectId'),
      Query.equal('completed', false),
      Query.equal('userId', userId),
      Query.limit(1),
    ];

    return databases.listDocuments<Task>(env.appwriteDatabaseId, env.appwriteTasksCollectionId, queries);
  },

  getCompleted: (userId: string): Promise<TasksResponse> => {
    const queries = [Query.equal('completed', true), Query.orderDesc('$updatedAt'), Query.equal('userId', userId)];

    return databases.listDocuments<Task>(env.appwriteDatabaseId, env.appwriteTasksCollectionId, queries);
  },

  getInbox: (userId: string): Promise<TasksResponse> => {
    const queries = [Query.equal('completed', false), Query.isNull('projectId'), Query.equal('userId', userId)];

    return databases.listDocuments<Task>(env.appwriteDatabaseId, env.appwriteTasksCollectionId, queries);
  },

  getToday: (todayDate: string, tomorrowDate: string, userId: string): Promise<TasksResponse> => {
    const queries = [
      Query.equal('completed', false),
      Query.and([Query.greaterThanEqual('due_date', todayDate), Query.lessThan('due_date', tomorrowDate)]),
      Query.equal('userId', userId),
    ];

    return databases.listDocuments<Task>(env.appwriteDatabaseId, env.appwriteTasksCollectionId, queries);
  },

  getUpcoming: (todayDate: string, userId: string): Promise<TasksResponse> => {
    const queries = [
      Query.equal('completed', false),
      Query.isNotNull('due_date'),
      Query.greaterThanEqual('due_date', todayDate),
      Query.orderAsc('due_date'),
      Query.equal('userId', userId),
    ];

    return databases.listDocuments<Task>(env.appwriteDatabaseId, env.appwriteTasksCollectionId, queries);
  },

  createMany: (id: string, inputs: TaskCreateData[]): Promise<Task[]> =>
    Promise.all(inputs.map((input) => taskRepository.create(id, input))),

  create: (id: string, data: TaskCreateData): Promise<Task> =>
    databases.createDocument<Task>(env.appwriteDatabaseId, env.appwriteTasksCollectionId, id, data),

  update: (id: string, data: TaskUpdateData): Promise<Task> =>
    databases.updateDocument<Task>(env.appwriteDatabaseId, env.appwriteTasksCollectionId, id, data),

  delete: (id: string) => databases.deleteDocument(env.appwriteDatabaseId, env.appwriteTasksCollectionId, id),
};
