import { ProjectBadge } from '@/components/atoms/ProjectBadge';
import { TaskDueDate } from '@/components/atoms/TaskDueDate';
import { CardFooter } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { IProject } from '@/types/project.types';
import { ITask } from '@/types/task.types';
import { useLocation } from 'react-router';

interface TaskMetaProps {
  project: IProject;
  task: ITask;
}

export const TaskMeta = ({ task, project }: TaskMetaProps) => {
  const { pathname } = useLocation();
  const showDueDate = Boolean(task.due_date) && pathname !== ROUTES.TODAY;
  const showProject = pathname !== ROUTES.INBOX && pathname !== ROUTES.PROJECT(project?.$id);

  if (!showDueDate && !showProject) return null;

  return (
    <CardFooter
      className="flex gap-4 p-0"
      role="contentinfo">
      {showDueDate && (
        <TaskDueDate
          completed={task.completed}
          date={task.due_date}
        />
      )}
      {showProject && <ProjectBadge project={task.project} />}
    </CardFooter>
  );
};
