import { Query } from 'appwrite';

export const taskQueries = {
  selectIdOnly: () => Query.select(['$id']),
  byUserId: (userId: string) => Query.equal('userId', userId),
  completed: (isCompleted: boolean) => Query.equal('completed', isCompleted),
  nullProject: () => Query.isNull('projectId'),
  notNullDueDate: () => Query.isNotNull('due_date'),
  dueDateRange: (start: string, end: string) =>
    Query.and([Query.greaterThanEqual('due_date', start), Query.lessThan('due_date', end)]),
  dueDateFrom: (date: string) => Query.greaterThanEqual('due_date', date),
  orderByDueDateAsc: () => Query.orderAsc('due_date'),
  orderByUpdatedDesc: () => Query.orderDesc('$updatedAt'),
  limit: (count: number) => Query.limit(count),
  todayTasks: (todayDate: string, tomorrowDate: string, userId: string) => [
    taskQueries.byUserId(userId),
    taskQueries.completed(false),
    taskQueries.dueDateRange(todayDate, tomorrowDate),
  ],
  todayCount: (todayDate: string, tomorrowDate: string, userId: string) => [
    taskQueries.selectIdOnly(),
    taskQueries.byUserId(userId),
    taskQueries.completed(false),
    taskQueries.dueDateRange(todayDate, tomorrowDate),
    taskQueries.limit(1),
  ],
  inboxTasks: (userId: string) => [
    taskQueries.byUserId(userId),
    taskQueries.completed(false),
    taskQueries.nullProject(),
  ],
  inboxCount: (userId: string) => [
    taskQueries.selectIdOnly(),
    taskQueries.byUserId(userId),
    taskQueries.completed(false),
    taskQueries.nullProject(),
    taskQueries.limit(1),
  ],
  completedTasks: (userId: string) => [
    taskQueries.byUserId(userId),
    taskQueries.completed(true),
    taskQueries.orderByUpdatedDesc(),
  ],
  upcomingTasks: (todayDate: string, userId: string) => [
    taskQueries.byUserId(userId),
    taskQueries.completed(false),
    taskQueries.notNullDueDate(),
    taskQueries.dueDateFrom(todayDate),
    taskQueries.orderByDueDateAsc(),
  ],
};
