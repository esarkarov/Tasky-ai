import { SideNavItem } from '@/components/molecules/SideNavItem';
import { TaskFormDialog } from '@/components/organisms/TaskFormDialog';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SIDEBAR_LINKS } from '@/constants/links';
import { ITaskCounts } from '@/types/task.types';
import { CirclePlus } from 'lucide-react';

interface SideNavMenuProps {
  currentPath: string;
  taskCounts: ITaskCounts;
  onNavigationClick: () => void;
}

export const SidebarNavGroup = ({ currentPath, taskCounts, onNavigationClick }: SideNavMenuProps) => (
  <SidebarGroup
    role="navigation"
    aria-label="Primary navigation">
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <TaskFormDialog>
            <SidebarMenuButton
              className="!text-primary"
              aria-label="Add new task">
              <CirclePlus aria-hidden="true" />
              <span>Add task</span>
            </SidebarMenuButton>
          </TaskFormDialog>
        </SidebarMenuItem>
        {SIDEBAR_LINKS.map((item, index) => (
          <SideNavItem
            key={index}
            item={item}
            isActive={currentPath === item.href}
            taskCounts={taskCounts}
            onNavigationClick={onNavigationClick}
          />
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);
