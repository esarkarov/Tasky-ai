import { TActionMode } from '@/types';
import { SendHorizonal } from 'lucide-react';
import { Button } from '../ui/button';

interface TaskSubmitButtonProps {
  isFormValid: boolean;
  onSubmit: () => void;
  mode: TActionMode;
}

export function TaskSubmitButton({ isFormValid, onSubmit, mode }: TaskSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={!isFormValid}
      onClick={onSubmit}
      aria-label={mode === 'create' ? 'Add task' : 'Save task'}>
      <span className="max-md:hidden">{mode === 'create' ? 'Add' : 'Save'}</span>
      <SendHorizonal
        className="md:hidden"
        aria-hidden="true"
      />
    </Button>
  );
}
