import { ProjectDeleteButton } from '@/components/projects/ProjectDeleteButton';
import { ProjectFormDialog } from '@/components/projects/ProjectFormDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IProject } from '@/interfaces';
import type { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';
import { Edit } from 'lucide-react';

interface ProjectActionMenuProps extends DropdownMenuContentProps {
  defaultFormData: IProject;
}

export const ProjectActionMenu = ({
  children,
  defaultFormData,
  ...props
}: ProjectActionMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent {...props}>
        <DropdownMenuItem asChild>
          <ProjectFormDialog
            method="PUT"
            defaultFormData={defaultFormData}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start px-2">
              <Edit /> Edit
            </Button>
          </ProjectFormDialog>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <ProjectDeleteButton defaultFormData={defaultFormData} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
