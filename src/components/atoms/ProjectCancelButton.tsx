import { Button } from '@/components/ui/button';

interface ProjectCancelButtonProps {
  onCancel: () => void;
}

export const ProjectCancelButton = ({ onCancel }: ProjectCancelButtonProps) => {
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
