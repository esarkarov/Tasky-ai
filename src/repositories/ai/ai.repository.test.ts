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
  const MOCK_CONTENTS = 'Test prompt content';

  const createMockResponse = (overrides?: Partial<GenerateContentResponse>): GenerateContentResponse => ({
    text: '{"result": "test response"}',
    data: '',
    functionCalls: [],
    executableCode: '',
    codeExecutionResult: '',
    ...overrides,
  });

  const expectGenerateContentCalledWith = (contents: string) => {
    expect(mockedGenerateContent).toHaveBeenCalledWith({
      model: DEFAULT_GEMINI_MODEL,
      contents,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: 'application/json',
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateContent', () => {
    it('should generate content successfully with correct parameters', async () => {
      const mockResponse = createMockResponse();
      mockedGenerateContent.mockResolvedValue(mockResponse);

      const result = await aiRepository.generateContent(MOCK_CONTENTS);

      expectGenerateContentCalledWith(MOCK_CONTENTS);
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty contents string', async () => {
      const emptyContents = '';
      const mockResponse = createMockResponse();
      mockedGenerateContent.mockResolvedValue(mockResponse);

      await aiRepository.generateContent(emptyContents);

      expectGenerateContentCalledWith(emptyContents);
    });

    it('should propagate errors when API fails', async () => {
      mockedGenerateContent.mockRejectedValue(new Error('API error'));

      await expect(aiRepository.generateContent(MOCK_CONTENTS)).rejects.toThrow('API error');
      expectGenerateContentCalledWith(MOCK_CONTENTS);
    });
  });
});
