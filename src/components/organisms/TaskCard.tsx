import { TaskForm } from '@/components/organisms/TaskForm';
import { TaskItem } from '@/components/organisms/TaskItem';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { ProjectEntity } from '@/types/projects.types';
import { TaskEntity } from '@/types/tasks.types';
import { memo, useState } from 'react';

interface TaskCardProps {
  id: string;
  content: string;
  completed: boolean;
  dueDate: Date;
  project: ProjectEntity;
}

export const TaskCard = memo(({ id, content, completed, dueDate, project }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { updateTask, fetcher } = useTaskOperations({
    onSuccess: () => setIsEditing(false),
  });

  const task: TaskEntity = Object.assign(
    {
      id,
      content,
      completed,
      due_date: dueDate,
      project,
    },
    fetcher.json as TaskEntity
  );

  return (
    <article
      className="task-card"
      role="listitem"
      aria-label={`Task: ${task.content}`}
      aria-checked={task.completed}>
      {!isEditing ? (
        <TaskItem
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
          mode="update"
          onCancel={() => setIsEditing(false)}
          onSubmit={updateTask}
        />
      )}
    </article>
  );
});

TaskCard.displayName = 'TaskCard';
