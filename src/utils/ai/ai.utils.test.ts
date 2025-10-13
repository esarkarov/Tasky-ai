import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateContents } from '@/utils/ai/ai.utils';

describe('ai utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('generateContents', () => {
    it('should generate contents with provided prompt and current date', () => {
      const mockDate = new Date('2023-01-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);
      const prompt = 'Build a todo app';

      const result = generateContents(prompt);

      expect(result).toContain('Build a todo app');
      expect(result).toContain(mockDate.toString());
      expect(result).toContain('Task Schema:');
      expect(result).toContain('content: string;');
      expect(result).toContain('due_date: Date | null;');
      expect(result).toContain('Array<Task>');
    });

    it('should generate contents with empty prompt', () => {
      const mockDate = new Date('2023-01-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);
      const prompt = '';

      const result = generateContents(prompt);

      expect(result).toContain('Prompt: ');
      expect(result).toContain(mockDate.toString());
    });

    it('should generate contents with special characters in prompt', () => {
      const mockDate = new Date('2023-01-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);
      const prompt = 'Task with "quotes" and {braces}';

      const result = generateContents(prompt);

      expect(result).toContain('Task with "quotes" and {braces}');
      expect(result).toContain(mockDate.toString());
    });

    it('should include all required schema fields and instructions', () => {
      const mockDate = new Date('2023-01-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);
      const prompt = 'test prompt';

      const result = generateContents(prompt);

      expect(result).toContain('Generate and return a list of tasks');
      expect(result).toContain('Task Schema:');
      expect(result).toContain('content: string;');
      expect(result).toContain('due_date: Date | null;');
      expect(result).toContain('Ensure tasks align with the provided prompt');
      expect(result).toContain("Set the 'due_date' relative to today's date");
      expect(result).toContain('Return an array of tasks matching the schema');
      expect(result).toContain('Output: Array<Task>');
    });
  });
});
