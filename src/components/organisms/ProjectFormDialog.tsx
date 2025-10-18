import { ProjectForm } from '@/components/organisms/ProjectForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useProjectOperations } from '@/hooks/use-project-operations';
import { HttpMethod } from '@/types/shared.types';
import { ProjectInput } from '@/types/projects.types';
import { ReactNode, useState } from 'react';

interface ProjectFormDialogProps {
  defaultFormData?: ProjectInput;
  children: ReactNode;
  method: HttpMethod;
}

export const ProjectFormDialog = ({ defaultFormData, children, method }: ProjectFormDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { saveProject, formState } = useProjectOperations({
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
          mode={method === 'POST' ? 'create' : 'update'}
          defaultFormData={defaultFormData}
          onCancel={() => setIsOpen(false)}
          onSubmit={saveProject}
          formState={formState}
        />
      </DialogContent>
    </Dialog>
  );
};
