import { generateID, toTitleCase, truncateString } from '@/utils/text/text.utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('text utils', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('toTitleCase', () => {
    it('should capitalize the first letter of a string', () => {
      const input = 'hello world';

      const result = toTitleCase(input);

      expect(result).toBe('Hello world');
    });

    it('should handle single character string', () => {
      const input = 'a';

      const result = toTitleCase(input);

      expect(result).toBe('A');
    });

    it('should handle empty string', () => {
      const input = '';

      const result = toTitleCase(input);

      expect(result).toBe('');
    });
  });

  describe('truncateString', () => {
    it('should truncate string when longer than max length', () => {
      const input = 'This is a very long string that needs truncation';
      const maxLength = 20;

      const result = truncateString(input, maxLength);

      expect(result).toBe('This is a very long...');
      expect(result.length).toBe(22);
    });

    it('should return original string when shorter than max length', () => {
      const input = 'Short string';
      const maxLength = 20;

      const result = truncateString(input, maxLength);

      expect(result).toBe('Short string');
    });

    it('should return original string when equal to max length', () => {
      const input = 'Exactly twenty chars';
      const maxLength = 20;

      const result = truncateString(input, maxLength);

      expect(result).toBe('Exactly twenty chars');
    });

    it('should handle empty string', () => {
      const input = '';
      const maxLength = 10;

      const result = truncateString(input, maxLength);

      expect(result).toBe('');
    });

    it('should handle max length of 1', () => {
      const input = 'Hello';
      const maxLength = 1;

      const result = truncateString(input, maxLength);

      expect(result).toBe('...');
    });

    it('should handle max length of 0', () => {
      const input = 'Hello';
      const maxLength = 0;

      const result = truncateString(input, maxLength);

      expect(result).toBe('Hell...');
    });
  });

  describe('generateID', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should generate a unique ID string', () => {
      const mockTimestamp = 1672531200000;
      vi.setSystemTime(mockTimestamp);
      const mockRandomValue = 0.123456789;
      vi.spyOn(Math, 'random').mockReturnValue(mockRandomValue);

      const result = generateID();

      expect(result).toMatch(/^[a-z0-9]+$/);
      expect(Math.random).toHaveBeenCalled();
    });

    it('should generate different IDs on subsequent calls', () => {
      let callCount = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        callCount++;
        return callCount * 0.1;
      });

      const id1 = generateID();
      const id2 = generateID();

      expect(id1).not.toBe(id2);
    });

    it('should include timestamp in the ID', () => {
      const mockTimestamp = 1672531200000;
      vi.setSystemTime(mockTimestamp);
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      const result = generateID();

      expect(result).toContain(Date.now().toString(36));
    });
  });
});
