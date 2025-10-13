import { formatCustomDate } from '@/utils/date/date.utils';
import { toTitleCase } from '@/utils/text/text.utils';
import { format, formatRelative, isSameYear } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/weekdays', () => ({
  WEEKDAYS: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
}));

vi.mock('@/utils/text/text.utils', () => ({
  toTitleCase: vi.fn(),
}));

vi.mock('date-fns', () => ({
  format: vi.fn(),
  formatRelative: vi.fn(),
  isSameYear: vi.fn(),
}));

const mockedToTitleCase = vi.mocked(toTitleCase);
const mockedFormat = vi.mocked(format);
const mockedFormatRelative = vi.mocked(formatRelative);
const mockedIsSameYear = vi.mocked(isSameYear);

describe('date utils', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatCustomDate', () => {
    it('should return weekday when relative day is in WEEKDAYS', () => {
      const mockDate = new Date('2023-01-01');
      const mockTitleCaseDay = 'Monday';

      mockedFormatRelative.mockReturnValue('Monday at 12:00');
      mockedToTitleCase.mockReturnValue(mockTitleCaseDay);

      const result = formatCustomDate(mockDate);

      expect(mockedFormatRelative).toHaveBeenCalledWith(mockDate, expect.any(Date));
      expect(mockedToTitleCase).toHaveBeenCalledWith(mockTitleCaseDay);
      expect(result).toBe(mockTitleCaseDay);
    });

    it('should return formatted date with month when same year and not weekday', () => {
      const mockDate = new Date('2023-06-15');
      const mockRelativeDay = 'Yesterday';
      const mockFormattedDate = '15 Jun';

      mockedFormatRelative.mockReturnValue('Yesterday at 12:00');
      mockedToTitleCase.mockReturnValue(mockRelativeDay);
      mockedIsSameYear.mockReturnValue(true);
      mockedFormat.mockReturnValue(mockFormattedDate);

      const result = formatCustomDate(mockDate);

      expect(mockedFormatRelative).toHaveBeenCalledWith(mockDate, expect.any(Date));
      expect(mockedToTitleCase).toHaveBeenCalledWith('Yesterday');
      expect(mockedIsSameYear).toHaveBeenCalledWith(mockDate, expect.any(Date));
      expect(mockedFormat).toHaveBeenCalledWith(mockDate, 'dd MMM');
      expect(result).toBe(mockFormattedDate);
    });

    it('should return formatted date with year when different year and not weekday', () => {
      const mockDate = new Date('2022-06-15');
      const mockRelativeDay = 'Yesterday';
      const mockFormattedDate = '15 Jun 2022';

      mockedFormatRelative.mockReturnValue('Yesterday at 12:00');
      mockedToTitleCase.mockReturnValue(mockRelativeDay);
      mockedIsSameYear.mockReturnValue(false);
      mockedFormat.mockReturnValue(mockFormattedDate);

      const result = formatCustomDate(mockDate);

      expect(mockedFormatRelative).toHaveBeenCalledWith(mockDate, expect.any(Date));
      expect(mockedToTitleCase).toHaveBeenCalledWith('Yesterday');
      expect(mockedIsSameYear).toHaveBeenCalledWith(mockDate, expect.any(Date));
      expect(mockedFormat).toHaveBeenCalledWith(mockDate, 'dd MMM yyyy');
      expect(result).toBe(mockFormattedDate);
    });

    it('should handle string date input', () => {
      const mockDateString = '2023-01-01';
      const mockTitleCaseDay = 'Tuesday';

      mockedFormatRelative.mockReturnValue('Tuesday at 12:00');
      mockedToTitleCase.mockReturnValue(mockTitleCaseDay);

      const result = formatCustomDate(mockDateString);

      expect(mockedFormatRelative).toHaveBeenCalledWith(mockDateString, expect.any(Date));
      expect(result).toBe(mockTitleCaseDay);
    });

    it('should handle timestamp date input', () => {
      const mockTimestamp = 1672531200000;
      const mockTitleCaseDay = 'Wednesday';

      mockedFormatRelative.mockReturnValue('Wednesday at 12:00');
      mockedToTitleCase.mockReturnValue(mockTitleCaseDay);

      const result = formatCustomDate(mockTimestamp);

      expect(mockedFormatRelative).toHaveBeenCalledWith(mockTimestamp, expect.any(Date));
      expect(result).toBe(mockTitleCaseDay);
    });

    it('should split relative format correctly when no "at" present', () => {
      const mockDate = new Date('2023-01-01');
      const mockFormattedDate = '01 Jan';

      mockedFormatRelative.mockReturnValue('Today');
      mockedToTitleCase.mockReturnValue('Today');
      mockedIsSameYear.mockReturnValue(true);
      mockedFormat.mockReturnValue(mockFormattedDate);

      const result = formatCustomDate(mockDate);

      expect(mockedFormatRelative).toHaveBeenCalledWith(mockDate, expect.any(Date));
      expect(mockedToTitleCase).toHaveBeenCalledWith('Today');
      expect(result).toBe(mockFormattedDate);
    });
  });
});
