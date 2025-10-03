import { Textarea } from '@/components/ui/textarea';

interface TaskContentInputProps {
  value: string;
  onSubmit: () => void;
  onChange: (value: string) => void;
}

export const TaskContentInput = ({ value, onChange, onSubmit }: TaskContentInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
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
        className="mb-2 p-1 !border-0 !ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="After finishing the project, take a tour"
        autoFocus
        value={value}
        onInput={(e) => onChange(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        aria-label="Task content input"
        aria-multiline="true"
      />

      <p className="sr-only">Press Enter to save, Shift+Enter for new line.</p>
    </div>
  );
};
