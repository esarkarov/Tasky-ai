import { TaskDisplay } from '@/components/organisms/TaskDisplay';
import { TaskForm } from '@/components/organisms/TaskForm';
import { useTaskOperations } from '@/hooks/use-taskOperations.tsx';
import { IProject } from '@/types/project.types';
import { ITask } from '@/types/task.types';
import { memo, useState } from 'react';

interface TaskCardProps {
  id: string;
  content: string;
  completed: boolean;
  dueDate: Date;
  project: IProject;
}

export const TaskCard = memo(({ id, content, completed, dueDate, project }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { updateTask, fetcher } = useTaskOperations({
    onSuccess: () => setIsEditing(false),
  });

  const task: ITask = Object.assign(
    {
      id,
      content,
      completed,
      due_date: dueDate,
      project,
    },
    fetcher.json as ITask
  );

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
          onEdit={() => setIsEditing(true)}
        />
      ) : (
        <TaskForm
          className="my-1"
          defaultFormData={{
            ...task,
            projectId: project && project?.$id,
          }}
          mode="edit"
          onCancel={() => setIsEditing(false)}
          onSubmit={updateTask}
        />
      )}
    </article>
  );
});

TaskCard.displayName = 'TaskCard';
