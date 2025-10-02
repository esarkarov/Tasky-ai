import { AITaskGenerator } from '@/components/molecules/AITaskGenerator';
import { ProjectNameInput } from '@/components/molecules/ProjectNameInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PROJECT_COLORS } from '@/constants/colors';
import { DEFAULT_PROJECT_FORM_DATA } from '@/constants/default';
import { IProject, IProjectForm } from '@/interfaces';
import { TActionMode } from '@/types';
import { Check, ChevronDown, Circle } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

interface ProjectFormProps {
  mode: TActionMode;
  defaultFormData?: IProject;
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
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  const handleColorSelect = (value: string) => {
    const [name, hex] = value.split('=');
    setColorName(name);
    setColorHex(hex);
    setIsOpen(false);
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

        <div>
          <Label htmlFor="color">Color</Label>
          <Popover
            modal
            open={isOpen}
            onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full mt-2"
                id="color">
                <Circle fill={colorHex} />
                {colorName}
                <ChevronDown className="ms-auto" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              className="p-0 w-[478px] max-sm:w-[360px]">
              <Command>
                <CommandInput placeholder="Search color..." />
                <CommandList>
                  <ScrollArea>
                    <CommandEmpty>No color found.</CommandEmpty>
                    <CommandGroup>
                      {PROJECT_COLORS.map(({ name, hex }) => (
                        <CommandItem
                          key={name}
                          value={`${name}=${hex}`}
                          onSelect={handleColorSelect}>
                          <Circle fill={hex} />
                          {name}
                          {colorName === name && <Check className="ms-auto" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </ScrollArea>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

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
