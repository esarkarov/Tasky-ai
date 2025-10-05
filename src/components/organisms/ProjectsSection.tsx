import { Collapsible } from '@/components/ui/collapsible';
import { SidebarGroup } from '@/components/ui/sidebar';
import { ProjectAddButton } from '../atoms/ProjectAddButton';
import { ProjectsGroupLabel } from '../molecules/ProjectsGroupLabel';
import { ProjectsNavContent } from './ProjectsNavContent';

interface ProjectsSectionProps {
  onItemClick: () => void;
}

export const ProjectsSection = ({ onItemClick }: ProjectsSectionProps) => {
  return (
    <Collapsible
      defaultOpen
      className="group/collapsible">
      <SidebarGroup>
        <ProjectsGroupLabel />
        <ProjectAddButton />
        <ProjectsNavContent onItemClick={onItemClick} />
      </SidebarGroup>
    </Collapsible>
  );
};
