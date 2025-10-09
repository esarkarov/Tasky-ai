import { Collapsible } from '@/components/ui/collapsible';
import { SidebarGroup } from '@/components/ui/sidebar';
import { AddProjectButton } from '../atoms/AddProjectButton';
import { ProjectsSidebarLabel } from '../molecules/ProjectsSidebarLabel';
import { ProjectsSidebarList } from './ProjectsSidebarList';

interface ProjectsSidebarSectionProps {
  onNavigationClick: () => void;
}

export const ProjectsSidebarSection = ({ onNavigationClick }: ProjectsSidebarSectionProps) => {
  return (
    <Collapsible
      defaultOpen
      className="group/collapsible">
      <SidebarGroup>
        <ProjectsSidebarLabel />
        <AddProjectButton />
        <ProjectsSidebarList onNavigationClick={onNavigationClick} />
      </SidebarGroup>
    </Collapsible>
  );
};
