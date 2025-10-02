import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IProjectInfo } from '@/interfaces';
import { TProjectList } from '@/types';
import { Check, ChevronDown, Hash, Inbox } from 'lucide-react';
import { useState } from 'react';

interface ProjectSelectorProps {
  setProjectInfo: (value: React.SetStateAction<IProjectInfo>) => void;
  setProjectId: (value: React.SetStateAction<string | null>) => void;
  projectInfo: IProjectInfo;
  projects: TProjectList;
}

export const ProjectSelector = ({ projectInfo, projects, setProjectId, setProjectInfo }: ProjectSelectorProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      modal>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={isOpen}
          className="max-w-max">
          {projectInfo.name ? <Hash color={projectInfo.colorHex} /> : <Inbox />}
          <span className="truncate">{projectInfo.name || 'Inbox'}</span>
          <ChevronDown />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[240px] p-0"
        align="start">
        <Command>
          <CommandInput placeholder="Search project..." />
          <CommandList>
            <ScrollArea>
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup>
                {projects &&
                  projects.documents.map(({ $id, name, color_hex }) => (
                    <CommandItem
                      key={$id}
                      onSelect={(selectedValue) => {
                        setProjectInfo({
                          name: selectedValue === projectInfo.name ? '' : name,
                          colorHex: selectedValue === projectInfo.name ? undefined : color_hex,
                        });
                        setProjectId(selectedValue === projectInfo.name ? null : $id);
                        setIsOpen(false);
                      }}>
                      <Hash color={color_hex} /> {name}
                      {projectInfo.name === name && <Check className="ms-auto" />}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
