import { CommandItem } from '@/components/ui/command';
import { Check } from 'lucide-react';
import { ReactNode } from 'react';

interface SelectableCommandItemProps {
  id: string;
  value: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
  icon: ReactNode;
  label: string;
}

export const SelectableCommandItem = ({ id, value, isSelected, onSelect, icon, label }: SelectableCommandItemProps) => {
  return (
    <CommandItem
      key={id}
      role="option"
      value={value}
      aria-selected={isSelected}
      onSelect={onSelect}>
      {icon}
      {label}
      {isSelected && (
        <Check
          className="ms-auto"
          aria-hidden="true"
        />
      )}
    </CommandItem>
  );
};
