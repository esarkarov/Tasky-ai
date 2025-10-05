import { Collapsible } from '@/components/ui/collapsible';
import { SidebarGroup } from '@/components/ui/sidebar';
import { ProjectAddButton } from '../atoms/ProjectAddButton';
import { ProjectsGroupLabel } from '../molecules/ProjectsGroupLabel';
import { ProjectsNavContent } from './ProjectsNavContent';

interface SidebarProjectsSectionProps {
  onNavigationClick: () => void;
}

export const SidebarProjectsSection = ({ onNavigationClick }: SidebarProjectsSectionProps) => {
  return (
    <Collapsible
      defaultOpen
      className="group/collapsible">
      <SidebarGroup>
        <ProjectsGroupLabel />
        <ProjectAddButton />
        <ProjectsNavContent onNavigationClick={onNavigationClick} />
      </SidebarGroup>
    </Collapsible>
  );
};
