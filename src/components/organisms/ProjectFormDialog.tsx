import { ProjectForm } from '@/components/organisms/ProjectForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useProjectOperations } from '@/hooks/use-projectOperations';
import { THttpMethod } from '@/types';
import { IProjectBase } from '@/types/project.types';
import { ReactNode, useState } from 'react';

interface ProjectFormDialogProps {
  defaultFormData?: IProjectBase;
  children: ReactNode;
  method: THttpMethod;
}

export const ProjectFormDialog = ({ defaultFormData, children, method }: ProjectFormDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { saveProject } = useProjectOperations({
    onSuccess: () => setIsOpen(false),
    method: method,
  });

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
          onSubmit={saveProject}
        />
      </DialogContent>
    </Dialog>
  );
};
