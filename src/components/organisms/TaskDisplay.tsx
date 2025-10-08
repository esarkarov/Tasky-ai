import { TaskCompletionButton } from '@/components/atoms/TaskCompletionButton';
import { TaskActionButtons } from '@/components/molecules/TaskActionButtons';
import { TaskMetadata } from '@/components/molecules/TaskMetaData';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IProject } from '@/types/project.types';
import { ITask } from '@/types/task.types';

interface TaskDisplayProps {
  project: IProject;
  task: ITask;
  onEdit: () => void;
}

export const TaskDisplay = ({ project, task, onEdit }: TaskDisplayProps) => (
  <div
    className="group/card relative grid grid-cols-[max-content,minmax(0,1fr)] gap-3 border-b"
    role="group"
    aria-labelledby={`task-${task.id}-content`}
    aria-describedby={`task-${task.id}-metadata`}>
    <TaskCompletionButton task={task} />
    <Card className="rounded-none py-2 space-y-1.5 border-none">
      <CardContent className="p-0">
        <p
          id={`task-${task.id}-content`}
          className={cn('text-sm max-md:me-16', task.completed && 'text-muted-foreground line-through')}>
          {task.content}
        </p>
      </CardContent>
      <TaskMetadata
        task={task}
        project={project}
      />
    </Card>
    <TaskActionButtons
      task={task}
      onEdit={onEdit}
    />
  </div>
);
