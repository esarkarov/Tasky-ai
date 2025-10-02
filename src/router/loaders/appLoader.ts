import { env } from '@/config/env';
import { ROUTES } from '@/constants/routes';
import { ITaskCounts } from '@/interfaces';
import { databases, Query } from '@/lib/appwrite';
import { getUserId } from '@/lib/utils';
import { startOfToday, startOfTomorrow } from 'date-fns';
import type { LoaderFunction } from 'react-router';
import { redirect } from 'react-router';

const getProjects = async () => {
  try {
    return await databases.listDocuments(env.appwriteDatabaseId, 'projects', [
      Query.select(['$id', 'name', 'color_name', 'color_hex', '$createdAt']),
      Query.orderDesc('$createdAt'),
      Query.limit(100),
      Query.equal('userId', getUserId()),
    ]);
  } catch (err) {
    console.log('Error getting projects: ', err);
    throw new Error('Error getting projects');
  }
};

const getTaskCounts = async () => {
  const taskCounts: ITaskCounts = {
    inboxTasks: 0,
    todayTasks: 0,
  };

  try {
    const { total: totalInboxTasks } = await databases.listDocuments(env.appwriteDatabaseId, 'tasks', [
      Query.select(['$id']),
      Query.isNull('projectId'),
      Query.equal('completed', false),
      Query.limit(1),
      Query.equal('userId', getUserId()),
    ]);

    taskCounts.inboxTasks = totalInboxTasks;
  } catch (err) {
    console.log(err);
    throw new Error('Error getting inbox task counts');
  }

  try {
    const { total: totalTodayTasks } = await databases.listDocuments(env.appwriteDatabaseId, 'tasks', [
      Query.select(['$id']),
      Query.and([
        Query.greaterThanEqual('due_date', startOfToday().toISOString()),
        Query.lessThan('due_date', startOfTomorrow().toISOString()),
      ]),
      Query.equal('completed', false),
      Query.limit(1),
      Query.equal('userId', getUserId()),
    ]);

    taskCounts.todayTasks = totalTodayTasks;
  } catch (err) {
    console.log(err);
    throw new Error('Error getting inbox task counts');
  }

  return taskCounts;
};

const appLoader: LoaderFunction = async () => {
  const userId = getUserId();

  if (!userId) return redirect(ROUTES.LOGIN);

  const projects = await getProjects();
  const taskCounts = await getTaskCounts();

  return { projects, taskCounts };
};

export default appLoader;
