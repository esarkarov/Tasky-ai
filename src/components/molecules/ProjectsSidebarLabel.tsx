import { ChevronRight } from 'lucide-react';
import { CollapsibleTrigger } from '../ui/collapsible';
import { SidebarGroupLabel } from '../ui/sidebar';

export const ProjectsSidebarLabel = () => {
  return (
    <SidebarGroupLabel
      asChild
      className="text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
      <CollapsibleTrigger
        aria-expanded
        aria-controls="projects-list">
        <ChevronRight className="me-2 transition-transform group-data-[state=open]/collapsible:rotate-90" />
        Projects
      </CollapsibleTrigger>
    </SidebarGroupLabel>
  );
};
