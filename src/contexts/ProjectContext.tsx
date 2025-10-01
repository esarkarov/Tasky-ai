import { TProjectList } from '@/types';
import { createContext, ReactNode, useContext } from 'react';

interface IProjectContext {
  projects: TProjectList;
}

interface ProjectProviderProps {
  projects: TProjectList;
  children: ReactNode;
}

const ProjectContext = createContext<IProjectContext>({ projects: null });

export const ProjectProvider = ({ projects, children }: ProjectProviderProps) => {
  return <ProjectContext.Provider value={{ projects }}>{children}</ProjectContext.Provider>;
};

export const useProjects = (): IProjectContext => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider!');
  }

  return context;
};

export const useProjectList = (): TProjectList => {
  const { projects } = useProjects();

  return projects;
};
