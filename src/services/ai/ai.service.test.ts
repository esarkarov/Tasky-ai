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
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('generateProjectTasks', () => {
    const mockPrompt = 'Create a project for building a website';
    const mockTasks: AIGeneratedTask[] = [
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
    const createMockGenerateContentResponse = (text: string) => ({
      text,
      data: '',
      functionCalls: [],
      executableCode: '',
      codeExecutionResult: '',
    });

    it('should return empty array when prompt is empty', async () => {
      const emptyPrompt = '';

      const result = await aiService.generateProjectTasks(emptyPrompt);

      expect(result).toEqual([]);
      expect(mockedGenerateContents).not.toHaveBeenCalled();
      expect(mockedAiRepository.generateContent).not.toHaveBeenCalled();
    });

    it('should return empty array when prompt is only whitespace', async () => {
      const whitespacePrompt = '   ';

      const result = await aiService.generateProjectTasks(whitespacePrompt);

      expect(result).toEqual([]);
      expect(mockedGenerateContents).not.toHaveBeenCalled();
      expect(mockedAiRepository.generateContent).not.toHaveBeenCalled();
    });

    it('should generate tasks successfully with valid prompt', async () => {
      const mockGeneratedContent = createMockGenerateContentResponse(JSON.stringify(mockTasks));
      const mockGeneratedContentsResult = 'generated-contents';

      mockedGenerateContents.mockReturnValue(mockGeneratedContentsResult);
      mockedAiRepository.generateContent.mockResolvedValue(mockGeneratedContent);

      const result = await aiService.generateProjectTasks(mockPrompt);

      expect(mockedGenerateContents).toHaveBeenCalledWith(mockPrompt);
      expect(mockedAiRepository.generateContent).toHaveBeenCalledWith(mockGeneratedContentsResult);
      expect(result).toEqual(mockTasks);
    });

    it('should return empty array when AI response text is empty', async () => {
      const mockGeneratedContent = createMockGenerateContentResponse('');
      mockedGenerateContents.mockReturnValue('generated-contents');
      mockedAiRepository.generateContent.mockResolvedValue(mockGeneratedContent);

      const result = await aiService.generateProjectTasks(mockPrompt);

      expect(result).toEqual([]);
    });

    it('should return empty array when AI response text is only whitespace', async () => {
      const mockGeneratedContent = createMockGenerateContentResponse('   ');
      mockedGenerateContents.mockReturnValue('generated-contents');
      mockedAiRepository.generateContent.mockResolvedValue(mockGeneratedContent);

      const result = await aiService.generateProjectTasks(mockPrompt);

      expect(result).toEqual([]);
    });

    it('should return empty array when JSON parsing fails', async () => {
      const mockGeneratedContent = createMockGenerateContentResponse('invalid-json');
      mockedGenerateContents.mockReturnValue('generated-contents');
      mockedAiRepository.generateContent.mockResolvedValue(mockGeneratedContent);

      const result = await aiService.generateProjectTasks(mockPrompt);

      expect(result).toEqual([]);
    });

    it('should return empty array when repository throws error', async () => {
      mockedGenerateContents.mockReturnValue('generated-contents');
      mockedAiRepository.generateContent.mockRejectedValue(new Error('API error'));

      const result = await aiService.generateProjectTasks(mockPrompt);

      expect(result).toEqual([]);
    });
  });
});
