import { TActionMode } from '@/types';
import { TaskCancelButton } from '../atoms/TaskCancelButton';
import { TaskSubmitButton } from '../atoms/TaskSubmitButton';

interface TaskFormActionsProps {
  mode: TActionMode;
  isFormValid: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const TaskFormActions = ({ mode, isFormValid, onCancel, onSubmit }: TaskFormActionsProps) => (
  <div
    className="flex items-center gap-2"
    role="group"
    aria-label="Task form actions">
    <TaskCancelButton onCancel={onCancel} />
    <TaskSubmitButton
      isFormValid={isFormValid}
      mode={mode}
      onSubmit={onSubmit}
    />
  </div>
);
