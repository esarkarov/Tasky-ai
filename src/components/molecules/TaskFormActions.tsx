import { CancelTaskButton } from '@/components/atoms/CancelTaskButton';
import { SubmitTaskButton } from '@/components/atoms/SubmitTaskButton';
import { CrudMode } from '@/types/shared.types';

interface TaskFormActionsProps {
  mode: CrudMode;
  disabled: boolean;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
}

export const TaskFormActions = ({ mode, disabled, onCancel, onSubmit }: TaskFormActionsProps) => (
  <div
    className="flex items-center gap-2"
    role="group"
    aria-label="Task form actions">
    <CancelTaskButton onCancel={onCancel} />
    <SubmitTaskButton
      mode={mode}
      disabled={disabled}
      onSubmit={onSubmit}
    />
  </div>
);
