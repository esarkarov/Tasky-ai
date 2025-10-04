import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ProjectNameInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const MAX_NAME_LENGTH = 120;
const NAME_WARNING_THRESHOLD = 110;

export const ProjectNameInput = ({ value, onChange, onKeyDown }: ProjectNameInputProps) => {
  const charCount = value.length;
  const isNearLimit = charCount >= NAME_WARNING_THRESHOLD;

  return (
    <div>
      <Label htmlFor="project_name">Project name</Label>
      <Input
        type="text"
        id="project_name"
        className="mt-2 mb-1"
        value={value}
        maxLength={MAX_NAME_LENGTH}
        onInput={(e) => onChange(e.currentTarget.value)}
        onKeyDown={onKeyDown}
        aria-describedby="project-name-count"
        aria-invalid={charCount > MAX_NAME_LENGTH}
      />
      <div
        id="project-name-count"
        className={cn('ms-auto max-w-max text-xs text-muted-foreground', isNearLimit && 'text-destructive')}
        aria-live="polite">
        {charCount}/{MAX_NAME_LENGTH}
      </div>
    </div>
  );
};
