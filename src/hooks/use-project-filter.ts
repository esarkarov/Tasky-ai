import { UseProjectFilterParams, UseProjectFilterResult } from '@/types/hooks.types';
import { useMemo, useState } from 'react';

export const useProjectFilter = ({ taskDocs }: UseProjectFilterParams): UseProjectFilterResult => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    if (!selectedProjectId || selectedProjectId === 'all') {
      return taskDocs;
    }

    if (selectedProjectId === 'inbox') {
      return taskDocs?.filter((task) => !task.projectId);
    }

    return taskDocs?.filter((task) => {
      const taskProjectId = typeof task.projectId === 'object' ? task.projectId?.$id : task.projectId;
      return taskProjectId === selectedProjectId;
    });
  }, [taskDocs, selectedProjectId]);

  const filteredCount = filteredTasks?.length || 0;

  return {
    filteredTasks,
    filteredCount,
    selectedProjectId,
    setSelectedProjectId,
  };
};
