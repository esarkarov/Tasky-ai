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
      <Label htmlFor="project_name">Name</Label>
      <Input
        type="text"
        id="project_name"
        className="mt-2 mb-1"
        onInput={(e) => onChange(e.currentTarget.value)}
        value={value}
        maxLength={MAX_NAME_LENGTH}
        onKeyDown={onKeyDown}
      />
      <div className={cn('text-xs text-muted-foreground max-w-max ms-auto', isNearLimit && 'text-destructive')}>
        {charCount}/{MAX_NAME_LENGTH}
      </div>
    </div>
  );
};
