import { CancelTaskButton } from '@/components/atoms/CancelTaskButton';
import { SubmitTaskButton } from '@/components/atoms/SubmitTaskButton';
import { TActionMode } from '@/types';

interface TaskFormActionsProps {
  mode: TActionMode;
  isFormValid: boolean;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
}

export const TaskFormActions = ({ mode, isFormValid, onCancel, onSubmit }: TaskFormActionsProps) => (
  <div
    className="flex items-center gap-2"
    role="group"
    aria-label="Task form actions">
    <CancelTaskButton onCancel={onCancel} />
    <SubmitTaskButton
      mode={mode}
      isFormValid={isFormValid}
      onSubmit={onSubmit}
    />
  </div>
);
