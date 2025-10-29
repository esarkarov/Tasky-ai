import { UseTaskFormParams, UseTaskFormResult } from '@/types/hooks.types';
import { ProjectInfo } from '@/types/projects.types';
import { TaskFormInput } from '@/types/tasks.types';
import * as chrono from 'chrono-node';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useTaskForm = ({
  defaultFormData,
  projectDocs,
  onSubmit,
  onCancel,
}: UseTaskFormParams): UseTaskFormResult => {
  const [taskContent, setTaskContent] = useState(defaultFormData.content);
  const [dueDate, setDueDate] = useState(defaultFormData.due_date);
  const [projectId, setProjectId] = useState(defaultFormData.projectId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: '',
    colorHex: '',
  });

  const formData = useMemo<TaskFormInput>(
    () => ({
      content: taskContent,
      due_date: dueDate,
      projectId: projectId,
    }),
    [taskContent, dueDate, projectId]
  );
  const isDisabled = taskContent.trim().length > 0;

  useEffect(() => {
    if (projectId && projectDocs) {
      const project = projectDocs?.find(({ $id }) => projectId === $id);
      if (project) {
        setProjectInfo({
          name: project.name,
          colorHex: project.color_hex,
        });
      }
    }
  }, [projectId, projectDocs]);

  useEffect(() => {
    if (taskContent) {
      const chronoParsed = chrono.parse(taskContent);
      if (chronoParsed.length > 0) {
        const lastDate = chronoParsed[chronoParsed.length - 1];
        setDueDate(lastDate.date());
      }
    }
  }, [taskContent]);

  const resetForm = useCallback(() => {
    setTaskContent('');
    setDueDate(null);
    setProjectId(null);
    setProjectInfo({ name: '', colorHex: '' });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!onSubmit || isSubmitting || !taskContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData, defaultFormData.id);
      resetForm();
      onCancel();
    } catch (error) {
      console.error('Task submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, isSubmitting, taskContent, formData, defaultFormData.id, resetForm, onCancel]);

  return {
    taskContent,
    dueDate,
    projectId,
    projectInfo,
    isSubmitting,
    formData,
    isDisabled,
    setTaskContent,
    setDueDate,
    setProjectId,
    setProjectInfo,
    handleSubmit,
    resetForm,
  };
};
