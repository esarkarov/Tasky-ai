import { ProjectsListResponse } from '@/types/project.types';
import { createContext, ReactNode, useContext } from 'react';

interface ProjectContextValue {
  projects: ProjectsListResponse;
}

interface ProjectProviderProps {
  projects: ProjectsListResponse;
  children: ReactNode;
}

const ProjectContext = createContext<ProjectContextValue>({ projects: { total: 0, documents: [] } });

export const ProjectProvider = ({ projects, children }: ProjectProviderProps) => {
  return <ProjectContext.Provider value={{ projects }}>{children}</ProjectContext.Provider>;
};

export const useProjects = (): ProjectContextValue => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider!');
  }

  return context;
};

export const useProjectList = (): ProjectsListResponse => {
  const { projects } = useProjects();

  return projects;
};
