import { useProjectList } from '@/contexts/ProjectContext';
import { Link, useLocation } from 'react-router';
import { CollapsibleContent } from '../ui/collapsible';
import { SidebarGroupContent, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { ROUTES } from '@/constants/routes';
import { ProjectActionMenu } from './ProjectActionMenu';
import { Hash, MoreHorizontal } from 'lucide-react';
import { AllProjectsButton } from '../atoms/AllProjectsButton';

interface ProjectsNavContentProps {
  onItemClick: () => void;
}

export const ProjectsNavContent = ({ onItemClick }: ProjectsNavContentProps) => {
  const projects = useProjectList();
  const location = useLocation();

  return (
    <CollapsibleContent id="projects-list">
      <SidebarGroupContent>
        <SidebarMenu>
          {projects?.documents.slice(0, 8).map(({ $id, name, color_hex, color_name }) => (
            <SidebarMenuItem key={$id}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === ROUTES.PROJECT($id)}
                onClick={onItemClick}>
                <Link
                  to={ROUTES.PROJECT($id)}
                  aria-label={`Open project ${name}`}
                  aria-current={location.pathname === ROUTES.PROJECT($id) ? 'page' : undefined}>
                  <Hash
                    color={color_hex}
                    aria-hidden="true"
                  />
                  <span>{name}</span>
                </Link>
              </SidebarMenuButton>

              <ProjectActionMenu
                defaultFormData={{
                  id: $id,
                  name,
                  color_name,
                  color_hex,
                }}
                side="right"
                align="start">
                <SidebarMenuAction
                  aria-label={`More actions for project ${name}`}
                  showOnHover
                  className="bg-sidebar-accent">
                  <MoreHorizontal aria-hidden="true" />
                </SidebarMenuAction>
              </ProjectActionMenu>
            </SidebarMenuItem>
          ))}
          {projects !== null && projects.total > 1 && (
            <SidebarMenuItem>
              <AllProjectsButton onItemClick={onItemClick} />
            </SidebarMenuItem>
          )}
          {!projects?.total && (
            <SidebarMenuItem>
              <p className="text-muted-foreground text-sm p-2">Click + to add some projects</p>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </CollapsibleContent>
  );
};
