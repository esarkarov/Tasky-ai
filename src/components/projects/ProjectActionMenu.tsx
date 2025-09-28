import { ProjectFormDialog } from '@/components/projects/ProjectFormDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HTTP_METHODS, ROUTES } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { IProject } from '@/interfaces';
import { truncateString } from '@/lib/utils';
import type { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';
import { Edit } from 'lucide-react';
import { useCallback } from 'react';
import { useFetcher, useLocation, useNavigate } from 'react-router';
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog';

interface ProjectActionMenuProps extends DropdownMenuContentProps {
  defaultFormData: IProject;
}

export const ProjectActionMenu = ({ children, defaultFormData, ...props }: ProjectActionMenuProps) => {
  const fetcher = useFetcher();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProjectDelete = useCallback(async () => {
    if (location.pathname === ROUTES.PROJECT(defaultFormData.id ?? undefined)) {
      navigate(ROUTES.INBOX);
    }

    const { id, update } = toast({
      title: 'Deleting project...',
      duration: Infinity,
    });

    try {
      await fetcher.submit(JSON.stringify(defaultFormData), {
        action: ROUTES.PROJECTS,
        method: HTTP_METHODS.DELETE,
        encType: 'application/json',
      });

      update({
        id,
        title: 'Project deleted',
        description: `The project ${truncateString(defaultFormData.name, 32)} has been successfully deleted.`,
        duration: 5000,
      });
    } catch (err) {
      console.log('Error deleting project: ', err);
      update({
        id,
        title: 'Error deleting project',
        description: `An error occurred while deleting the project.`,
        duration: 5000,
      });
    }
  }, [defaultFormData, fetcher, location.pathname, navigate, toast]);

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
          <ConfirmationDialog
            itemType="project"
            selectedItem={defaultFormData}
            onDelete={handleProjectDelete}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
