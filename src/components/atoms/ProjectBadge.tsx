import { ProjectEntity } from '@/types/projects.types';
import { Hash, Inbox } from 'lucide-react';

interface ProjectBadgeProps {
  project: ProjectEntity | null;
}

export const ProjectBadge = ({ project }: ProjectBadgeProps) => {
  return (
    <div
      className="grid grid-cols-[minmax(0,180px),max-content] items-center gap-1 text-xs text-muted-foreground ms-auto"
      aria-label="Task project">
      <div className="truncate text-right">{project?.name || 'Inbox'}</div>
      {project ? (
        <Hash
          size={14}
          color={project?.color_hex}
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
  );
};
