import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiRepository } from './ai.repository';
import { DEFAULT_GEMINI_MODEL } from '@/constants/defaults';
import { genAI } from '@/lib/google-ai';
import { GenerateContentResponse } from '@google/genai';

vi.mock('@/constants/defaults', () => ({
  DEFAULT_GEMINI_MODEL: 'gemini-pro',
}));

vi.mock('@/lib/google-ai', () => ({
  genAI: {
    models: {
      generateContent: vi.fn(),
    },
  },
}));

const mockedGenAI = vi.mocked(genAI);
const mockedGenerateContent = vi.mocked(mockedGenAI.models.generateContent);

describe('aiRepository', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('generateContent', () => {
    const mockContents = 'Test prompt content';
    const mockResponse: GenerateContentResponse = {
      text: '{"result": "test response"}',
      data: '',
      functionCalls: [],
      executableCode: '',
      codeExecutionResult: '',
    };

    it('should generate content successfully with correct parameters', async () => {
      mockedGenerateContent.mockResolvedValue(mockResponse);

      const result = await aiRepository.generateContent(mockContents);

      expect(mockedGenerateContent).toHaveBeenCalledWith({
        model: DEFAULT_GEMINI_MODEL,
        contents: mockContents,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors when generateContent fails', async () => {
      mockedGenerateContent.mockRejectedValue(new Error('API error'));

      await expect(aiRepository.generateContent(mockContents)).rejects.toThrow('API error');
      expect(mockedGenerateContent).toHaveBeenCalledWith({
        model: DEFAULT_GEMINI_MODEL,
        contents: mockContents,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
        },
      });
    });

    it('should call with empty contents string when provided', async () => {
      const emptyContents = '';
      mockedGenerateContent.mockResolvedValue(mockResponse);

      await aiRepository.generateContent(emptyContents);

      expect(mockedGenerateContent).toHaveBeenCalledWith({
        model: DEFAULT_GEMINI_MODEL,
        contents: emptyContents,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
        },
      });
    });
  });
});
