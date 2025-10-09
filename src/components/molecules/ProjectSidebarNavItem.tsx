import { MoreHorizontal } from 'lucide-react';
import { ProjectActionMenu } from '../organisms/ProjectActionMenu';
import { SidebarMenuAction, SidebarMenuItem } from '../ui/sidebar';
import { ProjectSidebarNavLink } from './ProjectSidebarNavLink';

interface ProjectSidebarNavItemProps {
  $id: string;
  name: string;
  colorHex: string;
  colorName: string;
  onNavigationClick: () => void;
}

export const ProjectSidebarNavItem = ({
  $id,
  name,
  colorHex,
  colorName,
  onNavigationClick,
}: ProjectSidebarNavItemProps) => {
  return (
    <SidebarMenuItem>
      <ProjectSidebarNavLink
        $id={$id}
        color={colorHex}
        name={name}
        onNavigationClick={onNavigationClick}
      />

      <ProjectActionMenu
        defaultFormData={{
          id: $id,
          name,
          color_name: colorName,
          color_hex: colorHex,
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
  );
};
