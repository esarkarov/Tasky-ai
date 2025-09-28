import { TaskActions } from '@/components/tasks/TaskActions';
import { TaskCompletionButton } from '@/components/tasks/TaskCompletionButton';
import { TaskMetadata } from '@/components/tasks/TaskMetaData';
import { Card, CardContent } from '@/components/ui/card';
import { ITask } from '@/interfaces';
import { cn } from '@/lib/utils';
import { Models } from 'appwrite';

interface TaskDisplayProps {
  project: Models.Document | null;
  task: ITask;
  onToggleComplete: (completed: boolean) => Promise<void>;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskDisplay = ({ project, task, onToggleComplete, onEdit, onDelete }: TaskDisplayProps) => (
  <div className="group/card relative grid grid-cols-[max-content,minmax(0,1fr)] gap-3 border-b">
    <TaskCompletionButton
      task={task}
      onToggleComplete={onToggleComplete}
    />

    <Card className="rounded-none py-2 space-y-1.5 border-none">
      <CardContent className="p-0">
        <p
          id="task-content"
          className={cn('text-sm max-md:me-16', task.completed && 'text-muted-foreground line-through')}>
          {task.content}
        </p>
      </CardContent>

      <TaskMetadata
        task={task}
        project={project}
      />
    </Card>

    <TaskActions
      task={task}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  </div>
);
