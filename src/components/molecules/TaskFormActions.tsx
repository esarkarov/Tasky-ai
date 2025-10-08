import { TActionMode } from '@/types';
import { TaskCancelButton } from '../atoms/TaskCancelButton';
import { TaskSubmitButton } from '../atoms/TaskSubmitButton';

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
    <TaskCancelButton onCancel={onCancel} />
    <TaskSubmitButton
      mode={mode}
      isFormValid={isFormValid}
      onSubmit={onSubmit}
    />
  </div>
);
