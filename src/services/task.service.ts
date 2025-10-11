import { generateID, getUserId } from '@/lib/utils';
import { taskRepository } from '@/repositories/task.repository';
import { AIGeneratedTask, Task, TaskCounts, TaskFormData, TasksResponse } from '@/types/tasks.types';
import { startOfToday, startOfTomorrow } from 'date-fns';

export const taskService = {
  getUpcomingTasks: async (): Promise<TasksResponse> => {
    const userId = getUserId();
    const todayDate = startOfToday().toISOString();
    try {
      const docs = await taskRepository.getUpcoming(todayDate, userId);

      return docs;
    } catch (error) {
      console.error('Error fetching upcoming tasks:', error);
      throw new Error('Failed to load upcoming tasks. Please try again.');
    }
  },

  getTodayTasks: async (): Promise<TasksResponse> => {
    const userId = getUserId();
    const todayStart = startOfToday().toISOString();
    const tomorrowStart = startOfTomorrow().toISOString();
    try {
      const docs = await taskRepository.getToday(todayStart, tomorrowStart, userId);

      return docs;
    } catch (error) {
      console.error('Error fetching today tasks:', error);
      throw new Error("Failed to load today's tasks. Please try again.");
    }
  },

  getInboxTasks: async (): Promise<TasksResponse> => {
    const userId = getUserId();
    try {
      const docs = await taskRepository.getInbox(userId);

      return docs;
    } catch (error) {
      console.error('Error fetching inbox tasks:', error);
      throw new Error("Failed to load inbox's tasks. Please try again.");
    }
  },

  getCompletedTasks: async (): Promise<TasksResponse> => {
    const userId = getUserId();
    try {
      const docs = await taskRepository.getCompleted(userId);

      return docs;
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
      throw new Error('Failed to load completed tasks. Please try again.');
    }
  },

  getInboxTaskCount: async (): Promise<number> => {
    const userId = getUserId();
    try {
      const { total } = await taskRepository.getInboxCountByUserId(userId);

      return total;
    } catch (error) {
      console.error('Error fetching inbox task count:', error);
      throw new Error('Failed to load inbox task count');
    }
  },

  getTodayTaskCount: async (): Promise<number> => {
    const userId = getUserId();
    const todayDate = startOfToday().toISOString();
    const tomorrowDate = startOfTomorrow().toISOString();
    try {
      const { total } = await taskRepository.getTodayCountByUserId(todayDate, tomorrowDate, userId);

      return total;
    } catch (error) {
      console.error('Error fetching today task count:', error);
      throw new Error('Failed to load today task count');
    }
  },

  getTaskCounts: async (): Promise<TaskCounts> => {
    const [inboxTasks, todayTasks] = await Promise.all([
      taskService.getInboxTaskCount(),
      taskService.getTodayTaskCount(),
    ]);

    return { inboxTasks, todayTasks };
  },

  createTasksForProject: async (projectId: string, tasks: AIGeneratedTask[]): Promise<Task[]> => {
    const userId = getUserId();
    try {
      const mapedTasks = tasks.map((task) => ({
        content: task.content,
        due_date: task.due_date || null,
        completed: task.completed || false,
        projectId,
        userId,
      }));

      const docs = await taskRepository.createMany(generateID(), mapedTasks);

      return docs;
    } catch (error) {
      console.error('Error creating tasks for project:', error);
      throw new Error('Failed to create project tasks');
    }
  },

  createTask: async (data: TaskFormData): Promise<Task> => {
    const userId = getUserId();
    try {
      const payload = {
        content: data.content,
        due_date: data.due_date,
        completed: data.completed || false,
        projectId: data.projectId,
        userId,
      };

      const doc = await taskRepository.create(generateID(), payload);

      return doc;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  },

  updateTask: async (taskId: string, data: Omit<TaskFormData, 'id'>): Promise<Task> => {
    try {
      const doc = await taskRepository.update(taskId, data);

      return doc;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  },

  deleteTask: async (taskId: string): Promise<void> => {
    try {
      await taskRepository.delete(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  },
};
