import { env } from '@/config/env';
import { ITaskCounts } from '@/interfaces';
import { databases, Query } from '@/lib/appwrite';
import { generateID, getUserId } from '@/lib/utils';
import { Models } from 'appwrite';
import { startOfToday, startOfTomorrow } from 'date-fns';

export interface ITask extends Models.Document {
  content: string;
  due_date: string | null;
  completed: boolean;
  userId: string;
  projectId: string | null;
}

export interface ITasksResponse {
  total: number;
  documents: ITask[];
}

export interface IAIGeneratedTask {
  content: string;
  due_date?: string | null;
  completed?: boolean;
}

export interface ITaskFormData {
  content: string;
  due_date?: string | null;
  completed?: boolean;
  projectId?: string | null;
}

export interface ITaskUpdateData {
  id: string;
  content?: string;
  due_date?: string | null;
  completed?: boolean;
  projectId?: string | null;
}

export const getUpcomingTasks = async (): Promise<ITasksResponse> => {
  try {
    const userId = getUserId();
    const todayDate = startOfToday().toISOString();

    const response = await databases.listDocuments<ITask>(env.appwriteDatabaseId, env.appwriteTasksCollectionId, [
      Query.equal('completed', false),
      Query.isNotNull('due_date'),
      Query.greaterThanEqual('due_date', todayDate),
      Query.orderAsc('due_date'),
      Query.equal('userId', userId),
    ]);

    return response;
  } catch (error) {
    console.error('Error fetching upcoming tasks:', error);
    throw new Error('Failed to load upcoming tasks. Please try again.');
  }
};

export const getTodayTasks = async (): Promise<ITasksResponse> => {
  try {
    const userId = getUserId();
    const todayStart = startOfToday().toISOString();
    const tomorrowStart = startOfTomorrow().toISOString();

    const response = await databases.listDocuments<ITask>(env.appwriteDatabaseId, env.appwriteTasksCollectionId, [
      Query.equal('completed', false),
      Query.and([Query.greaterThanEqual('due_date', todayStart), Query.lessThan('due_date', tomorrowStart)]),
      Query.equal('userId', userId),
    ]);

    return response;
  } catch (error) {
    console.error('Error fetching today tasks:', error);
    throw new Error("Failed to load today's tasks. Please try again.");
  }
};

export const getInboxTasks = async (): Promise<ITasksResponse> => {
  try {
    const userId = getUserId();

    return await databases.listDocuments(env.appwriteDatabaseId, env.appwriteTasksCollectionId, [
      Query.equal('completed', false),
      Query.isNull('projectId'),
      Query.equal('userId', userId),
    ]);
  } catch (error) {
    console.error('Error fetching inbox tasks:', error);
    throw new Error("Failed to load inbox's tasks. Please try again.");
  }
};

export const getCompletedTasks = async (): Promise<ITasksResponse> => {
  try {
    const userId = getUserId();

    return await databases.listDocuments(env.appwriteDatabaseId, env.appwriteTasksCollectionId, [
      Query.equal('completed', true),
      Query.orderDesc('$updatedAt'),
      Query.equal('userId', userId),
    ]);
  } catch (error) {
    console.error('Error fetching completed tasks:', error);
    throw new Error('Failed to load completed tasks. Please try again.');
  }
};

export const getInboxTaskCount = async (): Promise<number> => {
  try {
    const userId = getUserId();

    const { total } = await databases.listDocuments(env.appwriteDatabaseId, env.appwriteTasksCollectionId, [
      Query.select(['$id']),
      Query.isNull('projectId'),
      Query.equal('completed', false),
      Query.equal('userId', userId),
      Query.limit(1),
    ]);

    return total;
  } catch (error) {
    console.error('Error fetching inbox task count:', error);
    throw new Error('Failed to load inbox task count');
  }
};

export const getTodayTaskCount = async (): Promise<number> => {
  try {
    const userId = getUserId();
    const todayDate = startOfToday().toISOString();
    const tomorrowDate = startOfTomorrow().toISOString();

    const { total } = await databases.listDocuments(env.appwriteDatabaseId, env.appwriteTasksCollectionId, [
      Query.select(['$id']),
      Query.and([Query.greaterThanEqual('due_date', todayDate), Query.lessThan('due_date', tomorrowDate)]),
      Query.equal('completed', false),
      Query.equal('userId', userId),
      Query.limit(1),
    ]);

    return total;
  } catch (error) {
    console.error('Error fetching today task count:', error);
    throw new Error('Failed to load today task count');
  }
};

export const getTaskCounts = async (): Promise<ITaskCounts> => {
  const [inboxTasks, todayTasks] = await Promise.all([getInboxTaskCount(), getTodayTaskCount()]);

  return { inboxTasks, todayTasks };
};

export const createTasksForProject = async (projectId: string, tasks: IAIGeneratedTask[]): Promise<ITask[]> => {
  try {
    const userId = getUserId();

    const promises = tasks.map((task) =>
      databases.createDocument<ITask>(env.appwriteDatabaseId, env.appwriteTasksCollectionId, generateID(), {
        content: task.content,
        due_date: task.due_date || null,
        completed: task.completed || false,
        projectId,
        userId,
      })
    );

    return await Promise.all(promises);
  } catch (error) {
    console.error('Error creating tasks for project:', error);
    throw new Error('Failed to create project tasks');
  }
};

export const createTask = async (data: ITaskFormData): Promise<ITask> => {
  try {
    const task = await databases.createDocument<ITask>(
      env.appwriteDatabaseId,
      env.appwriteTasksCollectionId,
      generateID(),
      {
        content: data.content,
        due_date: data.due_date || null,
        completed: data.completed || false,
        projectId: data.projectId || null,
        userId: getUserId(),
      }
    );

    return task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
};

export const updateTask = async (taskId: string, data: Omit<ITaskUpdateData, 'id'>): Promise<ITask> => {
  try {
    const task = await databases.updateDocument<ITask>(
      env.appwriteDatabaseId,
      env.appwriteTasksCollectionId,
      taskId,
      data
    );

    return task;
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await databases.deleteDocument(env.appwriteDatabaseId, env.appwriteTasksCollectionId, taskId);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
};

export const toggleTaskCompletion = async (taskId: string, completed: boolean): Promise<ITask> => {
  return updateTask(taskId, { completed });
};
