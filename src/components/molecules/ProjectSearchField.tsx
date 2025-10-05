import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { TSearchStatus } from '@/types';
import { Loader2, Search } from 'lucide-react';
import { ChangeEventHandler } from 'react';

interface ProjectSearchFieldProps {
  handleChange: ChangeEventHandler<HTMLInputElement>;
  searchStatus: TSearchStatus;
}

export const ProjectSearchField = ({ handleChange, searchStatus }: ProjectSearchFieldProps) => {
  const isLoading = searchStatus !== 'idle';

  return (
    <div className="relative">
      <label
        htmlFor="project-search"
        className="sr-only">
        Search projects
      </label>

      <Search
        size={18}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />

      <Input
        id="project-search"
        type="search"
        name="q"
        placeholder="Search projects"
        className="pl-8 pr-8"
        onChange={handleChange}
        aria-describedby="search-status"
      />

      <Loader2
        size={18}
        className={cn(
          'absolute right-2 top-2 text-muted-foreground pointer-events-none hidden',
          isLoading && 'block animate-spin'
        )}
        aria-hidden={!isLoading}
      />

      <span
        id="search-status"
        className="sr-only"
        aria-live="polite">
        {isLoading ? 'Searching...' : 'Idle'}
      </span>
    </div>
  );
};
