import { Button } from '@/components/ui/button';
import { TActionMode } from '@/types';
import { SendHorizonal, X } from 'lucide-react';

interface TaskFormActionsProps {
  mode: TActionMode;
  isValid: boolean;
  onCancel?: () => void;
  onSubmit: () => void;
}

export const TaskFormActions = ({ mode, isValid, onCancel, onSubmit }: TaskFormActionsProps) => (
  <div
    className="flex items-center gap-2"
    role="group"
    aria-label="Task form actions">
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

    <Button
      type="submit"
      disabled={!isValid}
      onClick={onSubmit}
      aria-label={mode === 'create' ? 'Add task' : 'Save task'}>
      <span className="max-md:hidden">{mode === 'create' ? 'Add' : 'Save'}</span>
      <SendHorizonal
        className="md:hidden"
        aria-hidden="true"
      />
    </Button>
  </div>
);
