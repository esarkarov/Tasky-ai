import { AITaskGenerator } from '@/components/molecules/AITaskGenerator';
import { ColorSelector } from '@/components/molecules/ColorSelector';
import { ProjectNameInput } from '@/components/molecules/ProjectNameInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DEFAULT_PROJECT_FORM_DATA } from '@/constants';
import { IProject, IProjectForm } from '@/interfaces';
import { TActionMode } from '@/types';
import { useCallback, useMemo, useState } from 'react';

interface ProjectFormProps {
  defaultFormData?: IProject;
  mode: TActionMode;
  onCancel?: () => void;
  onSubmit?: (formData: IProjectForm) => void;
}

export const ProjectForm = ({
  defaultFormData = DEFAULT_PROJECT_FORM_DATA,
  mode,
  onCancel = () => {},
  onSubmit,
}: ProjectFormProps) => {
  const [projectName, setProjectName] = useState<string>(defaultFormData.name);
  const [colorName, setColorName] = useState<string>(defaultFormData.color_name);
  const [colorHex, setColorHex] = useState<string>(defaultFormData.color_hex);
  const [aiTaskGen, setAiTaskGen] = useState<boolean>(false);
  const [taskGenPrompt, setTaskGenPrompt] = useState<string>('');

  const formData = useMemo<IProjectForm>(
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

  const isFormValid = useMemo(() => {
    const hasName = Boolean(projectName.trim());
    const aiRequirementMet = !aiTaskGen || Boolean(taskGenPrompt.trim());
    return hasName && aiRequirementMet;
  }, [projectName, aiTaskGen, taskGenPrompt]);

  const handleSubmit = useCallback(() => {
    if (isFormValid && onSubmit) {
      onSubmit(formData);
    }
  }, [isFormValid, onSubmit, formData]);

  const handleKeySubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleColorChange = (name: string, hex: string) => {
    setColorName(name);
    setColorHex(hex);
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>{mode === 'create' ? 'Add project' : 'Edit'}</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="p-4 grid grid-cols-1 gap-2">
        <ProjectNameInput
          value={projectName}
          onChange={setProjectName}
          onKeyDown={handleKeySubmit}
        />

        <ColorSelector
          colorName={colorName}
          colorHex={colorHex}
          onColorChange={handleColorChange}
        />

        {mode === 'create' && (
          <AITaskGenerator
            enabled={aiTaskGen}
            prompt={taskGenPrompt}
            onToggle={setAiTaskGen}
            onPromptChange={setTaskGenPrompt}
            onKeyDown={handleKeySubmit}
          />
        )}
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-end gap-3 p-4">
        <Button
          variant="secondary"
          onClick={onCancel}>
          Cancel
        </Button>

        <Button
          disabled={!projectName || (aiTaskGen && !taskGenPrompt)}
          onClick={handleSubmit}>
          {mode === 'create' ? 'Add' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
};
