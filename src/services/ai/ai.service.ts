import { generateContents } from '@/utils/ai/ai.utils';
import { aiRepository } from '@/repositories/ai/ai.repository';
import { AIGeneratedTask } from '@/types/tasks.types';

export const aiService = {
  generateProjectTasks: async (prompt: string): Promise<AIGeneratedTask[]> => {
    if (!prompt?.trim()) return [];

    try {
      const contentResponse = await aiRepository.generateContent(generateContents(prompt));
      const contentResponseText = contentResponse.text?.trim();

      if (!contentResponseText) return [];

      const aiTasks = JSON.parse(contentResponseText) as AIGeneratedTask[];

      return aiTasks;
    } catch (error) {
      console.error('Error generating AI tasks:', error);
      return [];
    }
  },
};
