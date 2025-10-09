import { Button } from '@/components/ui/button';

interface CancelProjectButtonProps {
  onCancel: () => void;
}

export const CancelProjectButton = ({ onCancel }: CancelProjectButtonProps) => {
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={onCancel}
      aria-label="Cancel project form">
      Cancel
    </Button>
  );
};
