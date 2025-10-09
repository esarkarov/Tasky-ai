import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CancelTaskButtonProps {
  onCancel: () => void;
}

export const CancelTaskButton = ({ onCancel }: CancelTaskButtonProps) => {
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
};
