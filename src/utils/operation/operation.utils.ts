import { TIMING } from '@/constants/timing';
import { MAX_TRUNCATE_LENGTH } from '@/constants/validation';
import { Toast } from '@/hooks/use-toast';
import { truncateString } from '@/utils/text/text.utils';
import { HttpMethod } from '@/types/shared.types';
import { ToastHandler, ToastMessages } from '@/types/toast.types';

export const executeWithToast = async <T>(
  operation: () => Promise<T>,
  toastHandler: (options: Toast) => ToastHandler,
  messages: ToastMessages,
  successDescription: string,
  onSuccess?: () => void
): Promise<void> => {
  const { id, update } = toastHandler({
    title: messages.loading,
    duration: Infinity,
  });

  try {
    await operation();

    update({
      id,
      title: messages.success,
      description: successDescription,
      duration: TIMING.TOAST_DURATION,
    });

    onSuccess?.();
  } catch {
    update({
      id,
      title: messages.error,
      description: messages.errorDescription,
      duration: TIMING.TOAST_DURATION,
      variant: 'destructive',
    });
  }
};

export const buildTaskSuccessDescription = (content: string, prefix: string, maxLength: number = 50): string => {
  const truncated = truncateString(content, maxLength);
  return `${prefix} "${truncated}"`;
};

export const buildProjectSuccessDescription = (projectName: string, hasAiGen: boolean, method: HttpMethod): string => {
  const truncatedName = truncateString(projectName, MAX_TRUNCATE_LENGTH);
  const action = method === 'POST' ? 'created' : 'updated';
  const subject = hasAiGen ? 'and its tasks have' : 'has';

  return `The project ${truncatedName} ${hasAiGen ? subject : subject} been successfully ${action}.`;
};

export const buildSearchUrl = (baseUrl: string, searchValue: string): string => {
  return searchValue ? `${baseUrl}?q=${encodeURIComponent(searchValue)}` : baseUrl;
};
