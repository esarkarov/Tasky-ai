import { Plus } from 'lucide-react';
import { ProjectFormDialog } from '../organisms/ProjectFormDialog';
import { SidebarGroupAction } from '../ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export const ProjectAddButton = () => {
  return (
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
  );
};
