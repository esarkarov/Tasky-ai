import { DueDateSelector } from '@/components/molecules/DueDateSelector';
import { ProjectSelector } from '@/components/molecules/ProjectSelector';
import { TaskContentInput } from '@/components/molecules/TaskContentInput';
import { TaskFormActions } from '@/components/molecules/TaskFormActions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DEFAULT_TASK_FORM_DATA } from '@/constants/default';
import { useProjectList } from '@/contexts/ProjectContext';
import { cn } from '@/lib/utils';
import { TActionMode } from '@/types';
import { IProject, IProjectInfo } from '@/types/project.types';
import { ITaskFormData } from '@/types/task.types';
import * as chrono from 'chrono-node';
import type { ClassValue } from 'clsx';
import { useCallback, useEffect, useState } from 'react';

interface TaskFormProps {
  mode: TActionMode;
  className?: ClassValue;
  defaultFormData?: ITaskFormData;
  onSubmit?: (formData: ITaskFormData, taskId?: string) => Promise<void>;
  onCancel: () => void;
}

export const TaskForm = ({
  defaultFormData = DEFAULT_TASK_FORM_DATA,
  className,
  mode,
  onCancel,
  onSubmit,
}: TaskFormProps) => {
  const projects = useProjectList();
  const [taskContent, setTaskContent] = useState(defaultFormData.content);
  const [dueDate, setDueDate] = useState(defaultFormData.due_date);
  const [projectId, setProjectId] = useState(defaultFormData.projectId);
  const [projectInfo, setProjectInfo] = useState<IProjectInfo>({
    name: '',
    colorHex: '',
  });
  const [formData, setFormData] = useState<ITaskFormData>({
    content: '',
    due_date: null,
    projectId: null,
  });

  useEffect(() => {
    if (projectId) {
      const project = projects?.documents.find(({ $id }) => projectId === $id) as IProject;
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
    if (onSubmit) {
      await onSubmit(formData, defaultFormData.id);
    }
    setFormData(DEFAULT_TASK_FORM_DATA);
  }, [onSubmit, defaultFormData.id, formData]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [handleSubmit]);

  const isFormValid = taskContent.trim().length > 0;

  return (
    <Card
      role="form"
      aria-labelledby="task-form-title"
      className={cn('focus-within:border-foreground/30', className)}>
      <CardContent className="p-2">
        <h2
          id="task-form-title"
          className="sr-only">
          {mode === 'create' ? 'Create task' : 'Edit task'}
        </h2>
        <TaskContentInput
          value={taskContent}
          onChange={setTaskContent}
        />
        <DueDateSelector
          dueDate={dueDate as Date}
          onDateChange={setDueDate}
          onDateRemove={() => setDueDate(null)}
        />
      </CardContent>
      <Separator />
      <CardFooter className="grid grid-cols-[minmax(0,1fr),max-content] gap-2 p-2">
        <ProjectSelector
          setProjectInfo={setProjectInfo}
          setProjectId={setProjectId}
          projectInfo={projectInfo}
          projects={projects}
        />
        <TaskFormActions
          isFormValid={isFormValid}
          mode={mode}
          onCancel={onCancel}
          onSubmit={handleSubmit}
        />
      </CardFooter>
    </Card>
  );
};
