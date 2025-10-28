import { UseProjectFilterParams, UseProjectFilterResult } from '@/types/hooks.types';
import { useMemo } from 'react';

export const useProjectFilter = ({ tasks, selectedProjectId }: UseProjectFilterParams): UseProjectFilterResult => {
  const filteredTasks = useMemo(() => {
    if (!selectedProjectId || selectedProjectId === 'all') {
      return tasks;
    }

    if (selectedProjectId === 'inbox') {
      return tasks?.filter((task) => !task.projectId);
    }

    return tasks?.filter((task) => {
      const taskProjectId = typeof task.projectId === 'object' ? task.projectId?.$id : task.projectId;
      return taskProjectId === selectedProjectId;
    });
  }, [tasks, selectedProjectId]);

  const filteredCount = filteredTasks?.length || 0;

  return {
    filteredTasks,
    filteredCount,
  };
};
