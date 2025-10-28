import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectListItem } from '@/types/projects.types';
import { ClipboardCheck, Hash, Inbox } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface FilterSelectProps {
  setSelectedProjectId: Dispatch<SetStateAction<string | null>>;
  selectedProjectId: string | null;
  projectDocs: ProjectListItem[];
}

export const FilterSelect = ({ selectedProjectId, setSelectedProjectId, projectDocs }: FilterSelectProps) => {
  return (
    <Select
      value={selectedProjectId || 'all'}
      onValueChange={(value) => setSelectedProjectId(value === 'all' ? null : value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Projects" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <ClipboardCheck
              size={14}
              className="text-muted-foreground"
            />
            <span>All Projects</span>
          </div>
        </SelectItem>
        <SelectItem value="inbox">
          <div className="flex items-center gap-2">
            <Inbox
              size={14}
              className="text-muted-foreground"
            />
            <span>Inbox</span>
          </div>
        </SelectItem>
        {projectDocs.map((project) => (
          <SelectItem
            key={project.$id}
            value={project.$id}>
            <div className="flex items-center gap-2">
              <Hash
                size={14}
                style={{ color: project.color_hex }}
              />
              <span>{project.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
