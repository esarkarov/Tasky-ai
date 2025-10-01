import { ProjectActionMenu } from '@/components/projects/ProjectActionMenu';
import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { ROUTES } from '@/constants';
import { Models } from 'appwrite';
import { Hash, Link, MoreHorizontal } from 'lucide-react';

interface SideNavProjectItemProps {
  project: Models.Document;
  onItemClick: () => void;
}

export const SideNavProjectItem = ({ project, onItemClick }: SideNavProjectItemProps) => {
  const { $id, name, color_hex, color_name } = project;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={location.pathname === ROUTES.PROJECT($id)}
        onClick={onItemClick}>
        <Link to={ROUTES.PROJECT($id)}>
          <Hash color={color_hex} />
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
          aria-label="More actions"
          showOnHover
          className="bg-sidebar-accent">
          <MoreHorizontal />
        </SidebarMenuAction>
      </ProjectActionMenu>
    </SidebarMenuItem>
  );
};
