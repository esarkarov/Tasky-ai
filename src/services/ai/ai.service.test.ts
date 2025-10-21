import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiService } from './ai.service';
import { aiRepository } from '@/repositories/ai/ai.repository';
import { generateContents } from '@/utils/ai/ai.utils';
import { AIGeneratedTask } from '@/types/tasks.types';

vi.mock('@/repositories/ai/ai.repository', () => ({
  aiRepository: {
    generateContent: vi.fn(),
  },
}));
vi.mock('@/utils/ai/ai.utils', () => ({
  generateContents: vi.fn(),
}));

const mockedAiRepository = vi.mocked(aiRepository);
const mockedGenerateContents = vi.mocked(generateContents);

describe('aiService', () => {
  const MOCK_PROMPT = 'Create a project for building a website';
  const MOCK_GENERATED_CONTENTS = 'generated-contents';

  const createMockTasks = (): AIGeneratedTask[] => [
    {
      content: 'Setup React project',
      due_date: null,
      completed: false,
    },
    {
      content: 'Install dependencies',
      due_date: null,
      completed: false,
    },
  ];

  const createMockResponse = (text: string) => ({
    text,
    data: '',
    functionCalls: [],
    executableCode: '',
    codeExecutionResult: '',
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateProjectTasks', () => {
    describe('when prompt is invalid', () => {
      const mockInvalidPrompts = [
        { description: 'empty string', prompt: '' },
        { description: 'only whitespace', prompt: '   ' },
      ];

      it.each(mockInvalidPrompts)('should return empty array when prompt is $description', async ({ prompt }) => {
        const result = await aiService.generateProjectTasks(prompt);

        expect(result).toEqual([]);
        expect(mockedGenerateContents).not.toHaveBeenCalled();
        expect(mockedAiRepository.generateContent).not.toHaveBeenCalled();
      });
    });

    describe('when prompt is valid', () => {
      it('should generate tasks successfully', async () => {
        const mockTasks = createMockTasks();
        const mockResponse = createMockResponse(JSON.stringify(mockTasks));
        mockedGenerateContents.mockReturnValue(MOCK_GENERATED_CONTENTS);
        mockedAiRepository.generateContent.mockResolvedValue(mockResponse);

        const result = await aiService.generateProjectTasks(MOCK_PROMPT);

        expect(mockedGenerateContents).toHaveBeenCalledWith(MOCK_PROMPT);
        expect(mockedAiRepository.generateContent).toHaveBeenCalledWith(MOCK_GENERATED_CONTENTS);
        expect(result).toEqual(mockTasks);
      });
    });

    describe('when AI response is invalid', () => {
      const mockInvalidResponses = [
        { description: 'empty string', responseText: '' },
        { description: 'only whitespace', responseText: '   ' },
        { description: 'invalid JSON', responseText: 'invalid-json' },
      ];

      it.each(mockInvalidResponses)(
        'should return empty array when response text is $description',
        async ({ responseText }) => {
          const mockResponse = createMockResponse(responseText);
          mockedGenerateContents.mockReturnValue(MOCK_GENERATED_CONTENTS);
          mockedAiRepository.generateContent.mockResolvedValue(mockResponse);

          const result = await aiService.generateProjectTasks(MOCK_PROMPT);

          expect(result).toEqual([]);
        }
      );
    });

    describe('when repository fails', () => {
      it('should return empty array', async () => {
        mockedGenerateContents.mockReturnValue(MOCK_GENERATED_CONTENTS);
        mockedAiRepository.generateContent.mockRejectedValue(new Error('API error'));

        const result = await aiService.generateProjectTasks(MOCK_PROMPT);

        expect(result).toEqual([]);
      });
    });
  });
});
