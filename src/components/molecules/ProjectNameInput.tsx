import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MAX_NAME_LENGTH, NAME_WARNING_THRESHOLD } from '@/constants/validation';
import { InputValueCount } from '@/components/atoms/InputValueCount';

interface ProjectNameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const ProjectNameInput = ({ value, onChange, disabled }: ProjectNameInputProps) => {
  return (
    <div>
      <Label htmlFor="project_name">Project name</Label>
      <Input
        type="text"
        id="project_name"
        className="mt-2 mb-1"
        placeholder="Enter project name (e.g. Performance Tracker)"
        value={value}
        disabled={disabled}
        maxLength={MAX_NAME_LENGTH}
        onInput={(e) => onChange(e.currentTarget.value)}
        aria-describedby="project-name-count"
        aria-invalid={value.length > MAX_NAME_LENGTH}
      />
      <InputValueCount
        value={value}
        maxLength={MAX_NAME_LENGTH}
        threshold={NAME_WARNING_THRESHOLD}
      />
    </div>
  );
};
