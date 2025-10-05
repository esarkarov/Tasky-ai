import { TaskForm } from '@/components/organisms/TaskForm';
import { HTTP_METHODS } from '@/constants/http';
import { ROUTES } from '@/constants/routes';
import { IProject } from '@/types/project.types';
import { ITask, ITaskFormData } from '@/types/task.types';
import { memo, useCallback, useState } from 'react';
import { useFetcher } from 'react-router';
import { TaskDisplay } from './TaskDisplay';

interface TaskCardProps {
  id: string;
  content: string;
  completed: boolean;
  dueDate: Date;
  project: IProject;
}

export const TaskCard = memo(({ id, content, completed, dueDate, project }: TaskCardProps) => {
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const fetcherTask = fetcher.json as ITask;
  const task: ITask = Object.assign(
    {
      id,
      content,
      completed,
      due_date: dueDate,
      project,
    },
    fetcherTask
  );

  const handleToggleComplete = useCallback(
    async (newCompletedState: boolean) => {
      await fetcher.submit(JSON.stringify({ id: task.id, completed: newCompletedState }), {
        action: ROUTES.APP,
        method: HTTP_METHODS.PUT,
        encType: 'application/json',
      });
    },
    [fetcher, task.id]
  );

  const handleSubmitEdit = useCallback(
    (formData: ITaskFormData) => {
      fetcher.submit(
        JSON.stringify({
          ...formData,
          id: task.id,
        }),
        {
          action: ROUTES.APP,
          method: HTTP_METHODS.PUT,
          encType: 'application/json',
        }
      );
      setIsEditing(false);
    },
    [fetcher, task.id]
  );

  const handleDelete = useCallback(() => {
    fetcher.submit(JSON.stringify({ id: task.id }), {
      action: ROUTES.APP,
      method: HTTP_METHODS.DELETE,
      encType: 'application/json',
    });
  }, [fetcher, task.id]);

  return (
    <article
      className="task-card"
      role="listitem"
      aria-label={`Task: ${task.content}`}
      aria-checked={task.completed}>
      {!isEditing ? (
        <TaskDisplay
          task={task}
          project={project}
          onToggleComplete={handleToggleComplete}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
        />
      ) : (
        <TaskForm
          className="my-1"
          defaultFormData={{
            ...task,
            due_date: task.due_date,
            projectId: project?.$id ?? null,
          }}
          mode="edit"
          onCancel={() => setIsEditing(false)}
          onSubmit={handleSubmitEdit}
        />
      )}
    </article>
  );
});

TaskCard.displayName = 'TaskCard';
