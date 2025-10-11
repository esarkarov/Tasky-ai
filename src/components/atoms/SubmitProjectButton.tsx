import { CrudMode } from '@/types/shared.types';
import { Button } from '@/components/ui/button';

interface SubmitProjectButtonProps {
  mode: CrudMode;
  disabled: boolean;
  handleSubmit: () => void;
}

export const SubmitProjectButton = ({ mode, disabled, handleSubmit }: SubmitProjectButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={!disabled}
      onClick={handleSubmit}
      aria-label={mode === 'create' ? 'Add project' : 'Save project'}>
      {mode === 'create' ? 'Add' : 'Save'}
    </Button>
  );
};
