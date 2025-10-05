import { generateProjectTasks } from '@/api/googleAI';
import { IAIGeneratedTask } from '@/services/taskService';

export const createProjectTasks = async (prompt: string): Promise<IAIGeneratedTask[]> => {
  try {
    const response = await generateProjectTasks(prompt);

    if (!response) {
      return [];
    }

    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating AI tasks:', error);
    return [];
  }
};
