import { CancelProjectButton } from '@/components/atoms/CancelProjectButton';
import { SubmitProjectButton } from '@/components/atoms/SubmitProjectButton';
import { AITaskGenerator } from '@/components/molecules/AITaskGenerator';
import { ColorPicker } from '@/components/molecules/ColorPicker';
import { ProjectNameInput } from '@/components/molecules/ProjectNameInput';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DEFAULT_PROJECT_FORM_DATA } from '@/constants/defaults';
import { useProjectForm } from '@/hooks/use-project-form';
import { ProjectFormInput, ProjectInput } from '@/types/projects.types';
import { CrudMode } from '@/types/shared.types';
import { cn } from '@/utils/ui/ui.utils';

interface ProjectFormProps {
  onSubmit: (formData: ProjectFormInput) => Promise<void>;
  onCancel: () => void;
  mode: CrudMode;
  defaultFormData?: ProjectInput;
  formState: boolean;
}

export const ProjectForm = ({
  defaultFormData = DEFAULT_PROJECT_FORM_DATA,
  mode,
  onCancel,
  onSubmit,
  formState,
}: ProjectFormProps) => {
  const {
    projectName,
    colorHex,
    colorName,
    aiTaskGen,
    taskGenPrompt,
    isOpen,
    isSubmitting,
    isDisabled,
    setProjectName,
    setAiTaskGen,
    setTaskGenPrompt,
    setIsOpen,
    handleColorSelect,
    handleSubmit,
  } = useProjectForm({
    defaultFormData,
    onSubmit,
  });

  const isPending = isSubmitting || formState;

  return (
    <Card
      role="form"
      aria-labelledby="project-form-title"
      className={cn(
        'focus-within:border-foreground/30 transition-opacity',
        isPending && 'animate-pulse pointer-events-none'
      )}>
      <CardHeader className="p-4">
        <CardTitle id="project-form-title">{mode === 'create' ? 'Add project' : 'Edit project'}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 grid grid-cols-1 gap-3">
        <ProjectNameInput
          value={projectName}
          onChange={setProjectName}
          disabled={isPending}
        />
        <ColorPicker
          setIsOpen={setIsOpen}
          handleSelect={handleColorSelect}
          disabled={isPending}
          colorHex={colorHex}
          colorName={colorName}
          isOpen={isOpen}
        />
        {mode === 'create' && (
          <AITaskGenerator
            enabled={aiTaskGen}
            prompt={taskGenPrompt}
            onToggle={setAiTaskGen}
            onPromptChange={setTaskGenPrompt}
            disabled={isPending}
          />
        )}
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-end gap-3 p-4">
        <CancelProjectButton onCancel={onCancel} />
        <SubmitProjectButton
          mode={mode}
          handleSubmit={handleSubmit}
          disabled={isDisabled}
        />
      </CardFooter>
    </Card>
  );
};
