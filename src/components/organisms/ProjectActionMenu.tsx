import { ConfirmationDialog } from '@/components/molecules/ConfirmationDialog';
import { ProjectFormDialog } from '@/components/organisms/ProjectFormDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjectOperations } from '@/hooks/use-project-operations';
import { ProjectBase } from '@/types/projects.types';
import type { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';
import { Edit } from 'lucide-react';

interface ProjectActionMenuProps extends DropdownMenuContentProps {
  defaultFormData: ProjectBase;
}

export const ProjectActionMenu = ({ children, defaultFormData, ...props }: ProjectActionMenuProps) => {
  const { deleteProject } = useProjectOperations({
    projectData: defaultFormData,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        {...props}
        aria-label={`Actions for project ${defaultFormData.name}`}>
        <DropdownMenuItem asChild>
          <ProjectFormDialog
            method="PUT"
            defaultFormData={defaultFormData}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full justify-start px-2"
              aria-label={`Edit project ${defaultFormData.name}`}>
              <Edit aria-hidden="true" /> Edit
            </Button>
          </ProjectFormDialog>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ConfirmationDialog
            entityType="project"
            selectedItem={defaultFormData}
            onDelete={deleteProject}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
