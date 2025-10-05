import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PROJECT_COLORS } from '@/constants/colors';
import { Check, ChevronDown, Circle } from 'lucide-react';

interface ColorDropdownProps {
  isOpen: boolean;
  colorHex: string;
  colorName: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelect: (value: string) => void;
}

export const ColorSelector = ({ isOpen, setIsOpen, colorName, colorHex, handleSelect }: ColorDropdownProps) => {
  return (
    <div>
      <Label htmlFor="color">Color</Label>
      <Popover
        modal
        open={isOpen}
        onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="color"
            type="button"
            variant="outline"
            className="w-full mt-2 justify-between"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label={`Select project color (currently ${colorName})`}>
            <Circle
              fill={colorHex}
              aria-hidden="true"
            />
            <span>{colorName}</span>
            <ChevronDown
              className="ms-auto"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="p-0 w-[478px] max-sm:w-[360px]"
          role="listbox"
          aria-label="Available project colors">
          <Command>
            <CommandInput
              placeholder="Search color..."
              aria-label="Search color"
            />
            <CommandList>
              <ScrollArea>
                <CommandEmpty>No color found.</CommandEmpty>
                <CommandGroup>
                  {PROJECT_COLORS.map(({ name, hex }) => (
                    <CommandItem
                      key={name}
                      value={`${name}=${hex}`}
                      role="option"
                      aria-selected={colorName === name}
                      onSelect={handleSelect}>
                      <Circle
                        fill={hex}
                        aria-hidden="true"
                      />{' '}
                      {name}
                      {colorName === name && (
                        <Check
                          className="ms-auto"
                          aria-hidden="true"
                        />
                      )}
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
