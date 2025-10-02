import { GEMINI_DEFAULT_MODEL } from '@/constants/default';
import { genAI } from '@/lib/googleAI';
import { generateContents } from '@/lib/utils';

export const generateProjectTasks = async (prompt: string) => {
  try {
    const response = await genAI.models.generateContent({
      model: GEMINI_DEFAULT_MODEL,
      contents: generateContents(prompt),
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
        responseMimeType: 'application/json',
      },
    });
    return response.text;
  } catch (error) {
    console.log('Error generating tasks: ', error);
  }
};
