import { TActionMode } from '@/types';
import { Button } from '@/components/ui/button';

interface ProjectSubmitButtonProps {
  mode: TActionMode;
  isFormValid: boolean;
  handleSubmit: () => void;
}

export const ProjectSubmitButton = ({ mode, isFormValid, handleSubmit }: ProjectSubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={!isFormValid}
      onClick={handleSubmit}
      aria-label={mode === 'create' ? 'Add project' : 'Save project'}>
      {mode === 'create' ? 'Add' : 'Save'}
    </Button>
  );
};
