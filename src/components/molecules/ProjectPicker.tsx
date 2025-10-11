import { SelectableCommandItem } from '@/components/atoms/SelectableCommandItem';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectInfo, ProjectsListResponse } from '@/types/projects.types';
import { ChevronDown, Hash, Inbox } from 'lucide-react';
import { SetStateAction, useState } from 'react';

interface ProjectPickerProps {
  setProjectInfo: (value: SetStateAction<ProjectInfo>) => void;
  setProjectId: (value: string | null) => void;
  projectInfo: ProjectInfo;
  projects: ProjectsListResponse;
}

export const ProjectPicker = ({ projectInfo, projects, setProjectId, setProjectInfo }: ProjectPickerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      modal>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Select project"
          className="max-w-max">
          {projectInfo.name ? (
            <Hash
              color={projectInfo.colorHex}
              aria-hidden="true"
            />
          ) : (
            <Inbox aria-hidden="true" />
          )}
          <span className="truncate">{projectInfo.name || 'Inbox'}</span>
          <ChevronDown
            className="ml-1"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[240px] p-0"
        align="start"
        role="listbox"
        aria-label="Project list">
        <Command>
          <CommandInput
            placeholder="Search project..."
            aria-label="Search project"
          />
          <CommandList>
            <ScrollArea>
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup>
                {projects?.documents.map(({ $id, name, color_hex }) => {
                  const isSelected = projectInfo.name === name;

                  const handleProjectSelect = () => {
                    setProjectInfo({
                      name: isSelected ? '' : name,
                      colorHex: isSelected ? '' : color_hex,
                    });
                    setProjectId(isSelected ? null : $id);
                    setIsOpen(false);
                  };

                  return (
                    <SelectableCommandItem
                      key={$id}
                      id={$id}
                      value={`${name}=${color_hex}`}
                      isSelected={isSelected}
                      onSelect={handleProjectSelect}
                      icon={
                        <Hash
                          color={color_hex}
                          aria-hidden="true"
                        />
                      }
                      label={name}
                    />
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
