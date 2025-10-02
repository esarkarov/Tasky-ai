import { Button } from '@/components/ui/button';
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PROJECT_COLORS } from '@/constants';
import { Check, ChevronDown, Circle, Command } from 'lucide-react';
import { useState } from 'react';

interface ColorSelectorProps {
  colorName: string;
  colorHex: string;
  onColorChange: (name: string, hex: string) => void;
}

export const ColorSelector = ({ colorName, colorHex, onColorChange }: ColorSelectorProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleColorSelect = (value: string) => {
    const [name, hex] = value.split('=');
    onColorChange(name, hex);
    setIsOpen(false);
  };

  return (
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
  );
};
