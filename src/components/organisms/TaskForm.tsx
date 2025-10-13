import { ProjectPicker } from '@/components/molecules/ProjectPicker';
import { TaskContentInput } from '@/components/molecules/TaskContentInput';
import { TaskDueDatePicker } from '@/components/molecules/TaskDueDatePicker';
import { TaskFormActions } from '@/components/molecules/TaskFormActions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DEFAULT_TASK_FORM_DATA } from '@/constants/defaults';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { cn } from '@/utils/ui/ui.utils';
import { ProjectsLoaderData } from '@/types/loaders.types';
import { Project, ProjectInfo } from '@/types/projects.types';
import { CrudMode } from '@/types/shared.types';
import { TaskFormData } from '@/types/tasks.types';
import * as chrono from 'chrono-node';
import type { ClassValue } from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';

interface TaskFormProps {
  mode: CrudMode;
  className?: ClassValue;
  defaultFormData?: TaskFormData;
  onSubmit?: (formData: TaskFormData, taskId?: string) => Promise<void>;
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
  const { projects } = useLoaderData<ProjectsLoaderData>();
  const [taskContent, setTaskContent] = useState(defaultFormData.content);
  const [dueDate, setDueDate] = useState(defaultFormData.due_date);
  const [projectId, setProjectId] = useState(defaultFormData.projectId);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: '',
    colorHex: '',
  });
  const [formData, setFormData] = useState<TaskFormData>({
    content: '',
    due_date: null,
    projectId: null,
  });

  useEffect(() => {
    if (projectId) {
      const project = projects?.documents.find(({ $id }) => projectId === $id) as Project;
      if (project) {
        setProjectInfo({
          name: project.name,
          colorHex: project.color_hex,
        });
      }
    }
  }, [projectId, projects?.documents]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      content: taskContent,
      due_date: dueDate,
      projectId: projectId,
    }));
  }, [taskContent, dueDate, projectId]);

  useEffect(() => {
    if (taskContent) {
      const chronoParsed = chrono.parse(taskContent);

      if (chronoParsed.length) {
        const lastDate = chronoParsed[chronoParsed.length - 1];
        setDueDate(lastDate.date());
      }
    }
  }, [taskContent]);

  const handleSubmit = useCallback(async () => {
    if (onSubmit && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData, defaultFormData.id);
        setDueDate(null);
        setProjectId(null);
        setTaskContent('');
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [onSubmit, defaultFormData.id, formData, isSubmitting]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleSubmit();
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [handleSubmit]);

  const isDisabled = taskContent.trim().length > 0;
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
          projects={projects}
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
