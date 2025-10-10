import { CrudMode } from '@/types/shared.types';
import { Button } from '@/components/ui/button';

interface SubmitProjectButtonProps {
  mode: CrudMode;
  isFormValid: boolean;
  handleSubmit: () => void;
}

export const SubmitProjectButton = ({ mode, isFormValid, handleSubmit }: SubmitProjectButtonProps) => {
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
