import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { TSearchingState } from '@/types';
import { Loader2, Search } from 'lucide-react';

interface ProjectSearchFieldProps {
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  searchingState: TSearchingState;
}

export const ProjectSearchField = ({ handleChange, searchingState }: ProjectSearchFieldProps) => {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute top-1/2 -translate-y-1/2 left-2 text-muted-foreground pointer-events-none"
      />

      <Input
        type="text"
        name="q"
        placeholder="Search projects"
        className="px-8"
        onChange={handleChange}
      />

      <Loader2
        size={18}
        className={cn(
          'absolute top-2 right-2 text-muted-foreground pointer-events-none hidden',
          searchingState !== 'idle' && 'block animate-spin'
        )}
      />
    </div>
  );
};
