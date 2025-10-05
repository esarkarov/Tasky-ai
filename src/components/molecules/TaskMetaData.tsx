import { CardFooter } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { cn, formatCustomDate, getTaskDueDateColorClass } from '@/lib/utils';
import { IProject } from '@/types/project.types';
import { ITask } from '@/types/task.types';
import { CalendarDays, Hash, Inbox } from 'lucide-react';
import { useLocation } from 'react-router';

interface TaskMetadataProps {
  project: IProject;
  task: ITask;
}

export const TaskMetadata = ({ task, project }: TaskMetadataProps) => {
  const location = useLocation();
  const showDueDate = Boolean(task.due_date) && location.pathname !== ROUTES.TODAY;
  const showProject = location.pathname !== ROUTES.INBOX && location.pathname !== ROUTES.PROJECT(project?.$id);

  if (!showDueDate && !showProject) return null;
  console.log(showDueDate);

  return (
    <CardFooter
      className="flex gap-4 p-0"
      role="contentinfo">
      {showDueDate && (
        <div
          className={cn(
            'flex items-center gap-1 text-xs text-muted-foreground',
            getTaskDueDateColorClass(task.due_date ? (task.due_date as Date) : null, task.completed)
          )}
          aria-label="Task due date">
          <CalendarDays
            size={14}
            aria-hidden="true"
          />
          <time dateTime={new Date(task.due_date ?? '').toISOString()}>{formatCustomDate(task.due_date ?? '')}</time>
        </div>
      )}

      {showProject && (
        <div
          className="grid grid-cols-[minmax(0,180px),max-content] items-center gap-1 text-xs text-muted-foreground ms-auto"
          aria-label="Task project">
          <div className="truncate text-right">{task.project?.name || 'Inbox'}</div>
          {task.project ? (
            <Hash
              size={14}
              color={task.project.color_hex}
              aria-hidden="true"
            />
          ) : (
            <Inbox
              size={14}
              className="text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </CardFooter>
  );
};
