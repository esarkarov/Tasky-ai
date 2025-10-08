import { TActionMode } from '@/types';
import { SendHorizonal } from 'lucide-react';
import { Button } from '../ui/button';

interface TaskSubmitButtonProps {
  isFormValid: boolean;
  mode: TActionMode;
  onSubmit: () => Promise<void>;
}

export function TaskSubmitButton({ mode, isFormValid, onSubmit }: TaskSubmitButtonProps) {
  return (
    <Button
      type="submit"
      aria-label={mode === 'create' ? 'Add task' : 'Save task'}
      onClick={onSubmit}
      disabled={!isFormValid}>
      <span className="max-md:hidden">{mode === 'create' ? 'Add' : 'Save'}</span>
      <SendHorizonal
        className="md:hidden"
        aria-hidden="true"
      />
    </Button>
  );
}
