import { InputValueCount } from '@/components/atoms/InputValueCount';
import { Textarea } from '@/components/ui/textarea';
import { CONTENT_WARNING_THRESHOLD, MAX_CONTENT_LENGTH } from '@/constants/validation';

interface TaskContentInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TaskContentInput = ({ value, onChange }: TaskContentInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="task-content"
        className="sr-only">
        Task description
      </label>

      <Textarea
        id="task-content"
        className="mb-2 p-1"
        placeholder="After finishing the project, take a tour"
        autoFocus
        maxLength={MAX_CONTENT_LENGTH}
        value={value}
        onInput={(e) => onChange(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        aria-label="Task content input"
        aria-multiline="true"
      />
      <InputValueCount
        value={value}
        maxLength={MAX_CONTENT_LENGTH}
        threshold={CONTENT_WARNING_THRESHOLD}
      />
      <p className="sr-only">Press Enter to save, Shift+Enter for new line.</p>
    </div>
  );
};
