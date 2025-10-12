import { CancelProjectButton } from '@/components/atoms/CancelProjectButton';
import { SubmitProjectButton } from '@/components/atoms/SubmitProjectButton';
import { AITaskGenerator } from '@/components/molecules/AITaskGenerator';
import { ColorPicker } from '@/components/molecules/ColorPicker';
import { ProjectNameInput } from '@/components/molecules/ProjectNameInput';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DEFAULT_PROJECT_FORM_DATA } from '@/constants/defaults';
import { CrudMode } from '@/types/shared.types';
import { ProjectBase, ProjectFormData } from '@/types/projects.types';
import { useCallback, useMemo, useState } from 'react';
import { cn } from '@/utils/ui.utils';

interface ProjectFormProps {
  onSubmit: (formData: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  mode: CrudMode;
  defaultFormData?: ProjectBase;
  formState: boolean;
}

export const ProjectForm = ({
  defaultFormData = DEFAULT_PROJECT_FORM_DATA,
  mode,
  onCancel,
  onSubmit,
  formState,
}: ProjectFormProps) => {
  const [projectName, setProjectName] = useState<string>(defaultFormData.name);
  const [colorName, setColorName] = useState<string>(defaultFormData.color_name);
  const [colorHex, setColorHex] = useState<string>(defaultFormData.color_hex);
  const [aiTaskGen, setAiTaskGen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [taskGenPrompt, setTaskGenPrompt] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const formData = useMemo<ProjectFormData>(
    () => ({
      ...defaultFormData,
      name: projectName,
      color_name: colorName,
      color_hex: colorHex,
      ai_task_gen: aiTaskGen,
      task_gen_prompt: taskGenPrompt,
    }),
    [defaultFormData, projectName, colorName, colorHex, aiTaskGen, taskGenPrompt]
  );

  const isDisabled = useMemo(() => {
    const hasName = Boolean(projectName.trim());
    const aiRequirementMet = !aiTaskGen || Boolean(taskGenPrompt.trim());
    return hasName && aiRequirementMet;
  }, [projectName, aiTaskGen, taskGenPrompt]);

  const handleSubmit = useCallback(async () => {
    if (onSubmit && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [onSubmit, isSubmitting, formData]);

  const handleKeySubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleColorSelect = (value: string) => {
    const [name, hex] = value.split('=');
    setColorName(name);
    setColorHex(hex);
    setIsOpen(false);
  };

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
          onKeyDown={handleKeySubmit}
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
            onKeyDown={handleKeySubmit}
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
