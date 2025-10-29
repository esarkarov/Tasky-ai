import { ProjectPicker } from '@/components/molecules/ProjectPicker';
import { TaskContentInput } from '@/components/molecules/TaskContentInput';
import { TaskDueDatePicker } from '@/components/molecules/TaskDueDatePicker';
import { TaskFormActions } from '@/components/molecules/TaskFormActions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DEFAULT_TASK_FORM_DATA } from '@/constants/defaults';
import { useTaskForm } from '@/hooks/use-task-form';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { ProjectsLoaderData } from '@/types/loaders.types';
import { CrudMode } from '@/types/shared.types';
import { TaskFormInput } from '@/types/tasks.types';
import { cn } from '@/utils/ui/ui.utils';
import type { ClassValue } from 'clsx';
import { useLoaderData } from 'react-router';

interface TaskFormProps {
  mode: CrudMode;
  className?: ClassValue;
  defaultFormData?: TaskFormInput;
  onSubmit?: (formData: TaskFormInput, taskId?: string) => Promise<void>;
  onCancel: () => void;
}

export const TaskForm = ({
  defaultFormData = DEFAULT_TASK_FORM_DATA,
  className,
  mode,
  onCancel,
  onSubmit,
}: TaskFormProps) => {
  const { formState } = useTaskOperations({
    onSuccess: onCancel,
  });
  const {
    projects: { documents: projectDocs },
  } = useLoaderData<ProjectsLoaderData>();

  const {
    taskContent,
    dueDate,
    projectInfo,
    isSubmitting,
    isDisabled,
    setTaskContent,
    setDueDate,
    setProjectId,
    setProjectInfo,
    handleSubmit,
  } = useTaskForm({
    defaultFormData,
    projectDocs,
    onSubmit,
    onCancel,
  });

  const isPending = isSubmitting || formState;

  return (
    <Card
      role="form"
      aria-labelledby="task-form-title"
      aria-busy={isPending}
      className={cn(
        'focus-within:border-foreground/30 transition-opacity',
        isPending && 'animate-pulse pointer-events-none',
        className
      )}>
      <CardContent className="p-2">
        <h2
          id="task-form-title"
          className="sr-only">
          {mode === 'create' ? 'Create task' : 'Edit task'}
        </h2>
        <TaskContentInput
          value={taskContent}
          onChange={setTaskContent}
          disabled={isPending}
        />
        <TaskDueDatePicker
          dueDate={dueDate as Date}
          onDateChange={setDueDate}
          onDateRemove={() => setDueDate(null)}
          disabled={isPending}
        />
      </CardContent>
      <Separator />
      <CardFooter className="grid grid-cols-[minmax(0,1fr),max-content] gap-2 p-2">
        <ProjectPicker
          setProjectInfo={setProjectInfo}
          setProjectId={setProjectId}
          projectInfo={projectInfo}
          projectDocs={projectDocs}
          disabled={isPending}
        />
        <TaskFormActions
          disabled={isDisabled}
          mode={mode}
          onCancel={onCancel}
          onSubmit={handleSubmit}
        />
      </CardFooter>
    </Card>
  );
};
