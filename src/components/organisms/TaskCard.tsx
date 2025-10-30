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
  const [isEditing, setIsEditing] = useState(false);
  const { handleUpdateTask, fetcher } = useTaskOperations({
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
          handleEdit={() => setIsEditing(true)}
        />
      ) : (
        <TaskForm
          className="my-1"
          defaultValues={{
            ...task,
            projectId: project && project?.$id,
          }}
          mode="update"
          handleCancel={() => setIsEditing(false)}
          onSubmit={handleUpdateTask}
        />
      )}
    </article>
  );
});

TaskCard.displayName = 'TaskCard';
