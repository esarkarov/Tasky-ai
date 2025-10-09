import { AddProjectButton } from '@/components/atoms/AddProjectButton';
import { ProjectsSidebarLabel } from '@/components/molecules/ProjectsSidebarLabel';
import { ProjectsSidebarList } from '@/components/organisms/ProjectsSidebarList';
import { Collapsible } from '@/components/ui/collapsible';
import { SidebarGroup } from '@/components/ui/sidebar';

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
