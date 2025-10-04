import { ProjectFormDialog } from '@/components/organisms/ProjectFormDialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/constants/routes';
import { useProjectList } from '@/contexts/ProjectContext';
import { ChevronRight, Hash, MoreHorizontal, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { AllProjectsButton } from '../atoms/AllProjectsButton';
import { ProjectActionMenu } from './ProjectActionMenu';

interface ProjectsSectionProps {
  onItemClick: () => void;
}

export const ProjectsSection = ({ onItemClick }: ProjectsSectionProps) => {
  const projects = useProjectList();
  const location = useLocation();

  return (
    <Collapsible
      defaultOpen
      className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel
          asChild
          className="text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <CollapsibleTrigger
            aria-expanded
            aria-controls="projects-list">
            <ChevronRight className="me-2 transition-transform group-data-[state=open]/collapsible:rotate-90" />
            Projects
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <Tooltip>
          <ProjectFormDialog method="POST">
            <TooltipTrigger asChild>
              <SidebarGroupAction aria-label="Add project">
                <Plus aria-hidden="true" />
              </SidebarGroupAction>
            </TooltipTrigger>
          </ProjectFormDialog>
          <TooltipContent side="right">Add project</TooltipContent>
        </Tooltip>

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
      </SidebarGroup>
    </Collapsible>
  );
};
