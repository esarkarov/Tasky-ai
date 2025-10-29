import { AllProjectsButton } from '@/components/atoms/AllProjectsButton';
import { ProjectSidebarNavItem } from '@/components/molecules/ProjectSidebarNavItem';
import { CollapsibleContent } from '@/components/ui/collapsible';
import { SidebarGroupContent, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { ProjectsLoaderData } from '@/types/loaders.types';
import { useLoaderData } from 'react-router';

interface ProjectsSidebarListProps {
  onNavigationClick: () => void;
}

export const ProjectsSidebarList = ({ onNavigationClick }: ProjectsSidebarListProps) => {
  const {
    projects: { documents, total },
  } = useLoaderData<ProjectsLoaderData>();

  return (
    <CollapsibleContent id="projects-list">
      <SidebarGroupContent>
        <SidebarMenu>
          {documents.slice(0, 8).map(({ $id, name, color_hex, color_name }) => (
            <ProjectSidebarNavItem
              key={$id}
              id={$id}
              name={name}
              colorHex={color_hex}
              colorName={color_name}
              onNavigationClick={onNavigationClick}
            />
          ))}
          {documents !== null && total > 8 && (
            <SidebarMenuItem>
              <AllProjectsButton onNavigationClick={onNavigationClick} />
            </SidebarMenuItem>
          )}
          {!total && (
            <SidebarMenuItem>
              <p className="text-muted-foreground text-sm p-2">Click + to add some projects</p>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </CollapsibleContent>
  );
};
