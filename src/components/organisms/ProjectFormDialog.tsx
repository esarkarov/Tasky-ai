import { ProjectForm } from '@/components/organisms/ProjectForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ROUTES } from '@/constants/routes';
import { useToast } from '@/hooks/use-toast';
import { IProject, IProjectForm } from '@/interfaces';
import { truncateString } from '@/lib/utils';
import { TActionMethod } from '@/types';
import { ReactNode, useCallback, useState } from 'react';
import { useFetcher } from 'react-router';

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

      <DialogContent
        className="p-0 border-0 !rounded-xl"
        aria-label={method === 'POST' ? 'Create project form' : 'Edit project form'}>
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
