import { DEFAULT_GEMINI_MODEL } from '@/constants/defaults';
import { genAI } from '@/lib/google-ai';
import { GenerateContentResponse } from '@google/genai';

export const aiRepository = {
  generateContent: (contents: string): Promise<GenerateContentResponse> =>
    genAI.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: 'application/json',
      },
    }),
};
