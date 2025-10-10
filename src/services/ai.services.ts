import { DEFAULT_GEMINI_MODEL } from '@/constants/defaults';
import { genAI } from '@/lib/googleAI';
import { generateContents } from '@/lib/utils';
import { AIGeneratedTask } from '@/types/tasks.types';

export const generateProjectTasks = async (prompt: string): Promise<AIGeneratedTask[]> => {
  if (!prompt?.trim()) return [];

  try {
    const response = await genAI.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents: generateContents(prompt),
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
        responseMimeType: 'application/json',
      },
    });
    const responseText = response.text?.trim();

    if (!responseText) {
      return [];
    }

    const tasks = JSON.parse(responseText) as AIGeneratedTask[];

    return tasks;
  } catch (error) {
    console.error('Error generating AI tasks:', error);
    return [];
  }
};
