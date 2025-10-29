import { SelectableCommandItem } from '@/components/atoms/SelectableCommandItem';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PROJECT_COLORS } from '@/constants/colors';
import { ChevronDown, Circle } from 'lucide-react';

interface ColorPickerProps {
  isOpen: boolean;
  colorHex: string;
  colorName: string;
  setIsOpen: (open: boolean) => void;
  handleSelect: (value: string) => void;
  disabled: boolean;
}

export const ColorPicker = ({ isOpen, setIsOpen, colorName, colorHex, handleSelect, disabled }: ColorPickerProps) => {
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
            disabled={disabled}
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
              disabled={disabled}
            />
            <CommandList>
              <ScrollArea>
                <CommandEmpty>No color found.</CommandEmpty>
                <CommandGroup>
                  {PROJECT_COLORS.map(({ name, hex }) => {
                    const isSelected = colorName === name;

                    return (
                      <SelectableCommandItem
                        key={name}
                        id={name}
                        value={`${name}=${hex}`}
                        isSelected={isSelected}
                        onSelect={handleSelect}
                        icon={
                          <Circle
                            fill={hex}
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
    </div>
  );
};
