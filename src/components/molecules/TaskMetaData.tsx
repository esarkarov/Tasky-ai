import { CardFooter } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { IProject } from '@/types/project.types';
import { ITask } from '@/types/task.types';
import { useLocation } from 'react-router';
import { DueDate } from '../atoms/DueDate';
import { ProjectMeta } from '../atoms/ProjectMeta';

interface TaskMetadataProps {
  project: IProject;
  task: ITask;
}

export const TaskMetadata = ({ task, project }: TaskMetadataProps) => {
  const location = useLocation();
  const showDueDate = Boolean(task.due_date) && location.pathname !== ROUTES.TODAY;
  const showProject = location.pathname !== ROUTES.INBOX && location.pathname !== ROUTES.PROJECT(project?.$id);

  if (!showDueDate && !showProject) return null;

  return (
    <CardFooter
      className="flex gap-4 p-0"
      role="contentinfo">
      {showDueDate && (
        <DueDate
          completed={task.completed}
          date={task.due_date}
        />
      )}
      {showProject && <ProjectMeta project={task.project} />}
    </CardFooter>
  );
};
