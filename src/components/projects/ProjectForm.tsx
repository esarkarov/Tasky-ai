import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { DEFAULT_PROJECT_FORM_DATA, PROJECT_COLORS } from '@/constants';
import { IProject, IProjectForm } from '@/interfaces';
import { cn } from '@/lib/utils';
import { TActionMode } from '@/types';
import { Bot, Check, ChevronDown, Circle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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
  const [projectNameCharCount, setProjectNameCharCount] = useState<number>(
    defaultFormData.name.length
  );
  const [colorName, setColorName] = useState<string>(defaultFormData.color_name);
  const [colorHex, setColorHex] = useState<string>(defaultFormData.color_hex);
  const [colorOpen, setColorOpen] = useState<boolean>(false);
  const [aiTaskGen, setAiTaskGen] = useState<boolean>(false);
  const [taskGenPrompt, setTaskGenPrompt] = useState<string>('');
  const [formData, setFormData] = useState<IProjectForm>({
    ...defaultFormData,
    ai_task_gen: aiTaskGen,
    task_gen_prompt: taskGenPrompt,
  });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      name: projectName,
      color_name: colorName,
      color_hex: colorHex,
      ai_task_gen: aiTaskGen,
      task_gen_prompt: taskGenPrompt,
    }));
  }, [projectName, colorName, colorHex, aiTaskGen, taskGenPrompt]);

  const handleSubmit = useCallback(() => {
    if (onSubmit) onSubmit(formData);
  }, [onSubmit, formData]);

  const handleKeySubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>{mode === 'create' ? 'Add project' : 'Edit'}</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="p-4 grid grid-cols-1 gap-2">
        <div>
          <Label htmlFor="project_name">Name</Label>

          <Input
            type="text"
            id="project_name"
            className="mt-2 mb-1"
            onInput={(e) => {
              setProjectName(e.currentTarget.value);
              setProjectNameCharCount(e.currentTarget.value.length);
            }}
            value={projectName}
            maxLength={120}
            onKeyDown={handleKeySubmit}
          />

          <div
            className={cn(
              'text-xs text-muted-foreground max-w-max ms-auto',
              projectNameCharCount >= 110 && 'text-destructive'
            )}>
            {projectNameCharCount}/120
          </div>
        </div>

        <div>
          <Label htmlFor="color">Color</Label>

          <Popover
            modal={true}
            open={colorOpen}
            onOpenChange={setColorOpen}>
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
                          onSelect={(value) => {
                            const [name, hex] = value.split('=');

                            setColorName(name);
                            setColorHex(hex);
                            setColorOpen(false);
                          }}>
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
          <div className="border rounded-md mt-6">
            <div className="flex items-center gap-3 py-2 px-3">
              <Bot className="text-muted-foreground flex-shrink-0" />

              <div className="space-y-0.5 me-auto">
                <Label
                  htmlFor="ai_generate"
                  className="block text-sm">
                  AI Task Generator
                </Label>

                <p className="text-xs text-muted-foreground">
                  Automatically create tasks by providing a simple prompt.
                </p>
              </div>

              <Switch
                id="ai_generate"
                onCheckedChange={setAiTaskGen}
              />
            </div>

            {aiTaskGen && (
              <Textarea
                autoFocus
                placeholder="Tell me about your project. What you want to accomplish?"
                className="border-none"
                value={taskGenPrompt}
                onChange={(e) => setTaskGenPrompt(e.currentTarget.value)}
                onKeyDown={handleKeySubmit}
              />
            )}
          </div>
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
