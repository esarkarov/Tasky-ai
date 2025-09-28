import { ReactNode, useCallback, useState } from 'react';
import { useFetcher } from 'react-router';
import { truncateString } from '@/lib/utils';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { useToast } from '@/hooks/use-toast';
import { IProject, IProjectForm } from '@/interfaces';
import { TActionMethod } from '@/types';
import { ROUTES } from '@/constants';

interface ProjectFormDialogProps {
  defaultFormData?: IProject;
  children: ReactNode;
  method: TActionMethod;
}

export const ProjectFormDialog = ({ defaultFormData, children, method }: ProjectFormDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const fetcher = useFetcher();

  const handleProjectCreate = useCallback(
    async (data: IProjectForm) => {
      setIsOpen(false);

      const { id, update } = toast({
        title: `${method === 'POST' ? 'Creating' : 'Updating'} project...`,
        duration: Infinity,
      });

      await fetcher.submit(JSON.stringify(data), {
        action: ROUTES.PROJECTS,
        method,
        encType: 'application/json',
      });

      update({
        id,
        title: `Project ${method === 'POST' ? 'created' : 'updated'}.`,
        description: `The project ${truncateString(data.name, 32)} ${data.ai_task_gen ? 'and its tasks' : ''} have been successfully ${method === 'POST' ? 'created' : 'updated'}.`,
        duration: 5000,
      });
    },
    [fetcher, method, toast]
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="p-0 border-0 !rounded-xl">
        <ProjectForm
          mode={method === 'POST' ? 'create' : 'edit'}
          defaultFormData={defaultFormData}
          onCancel={() => setIsOpen(false)}
          onSubmit={handleProjectCreate}
        />
      </DialogContent>
    </Dialog>
  );
};
