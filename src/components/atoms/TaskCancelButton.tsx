import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface TaskCancelButtonProps {
  onCancel: () => void;
}

export function TaskCancelButton({ onCancel }: TaskCancelButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={onCancel}
      aria-label="Cancel task form">
      <span className="max-md:hidden">Cancel</span>
      <X
        className="md:hidden"
        aria-hidden="true"
      />
    </Button>
  );
}
