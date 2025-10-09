import { TaskSidebarNavLink } from '@/components/molecules/TaskSidebarNavLink';
import { TaskFormDialog } from '@/components/organisms/TaskFormDialog';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { TASK_SIDEBAR_LINKS } from '@/constants/links';
import { TaskCounts } from '@/types/task.types';
import { CirclePlus } from 'lucide-react';

interface TaskSidebarNavGroupProps {
  currentPath: string;
  taskCounts: TaskCounts;
  onNavigationClick: () => void;
}

export const TaskSidebarNavGroup = ({ currentPath, taskCounts, onNavigationClick }: TaskSidebarNavGroupProps) => (
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
        {TASK_SIDEBAR_LINKS.map((item, index) => (
          <TaskSidebarNavLink
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
