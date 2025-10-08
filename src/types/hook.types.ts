import { THttpMethod } from '@/types';
import { IProjectBase, IProjectFormData } from '@/types/project.types';
import { useFetcher } from 'react-router';

export interface IUseProjectOperationsParams {
  method?: THttpMethod;
  projectData?: IProjectBase;
  onSuccess?: () => void;
}

export interface IUseProjectOperationsResult {
  saveProject: (data: IProjectFormData) => Promise<void>;
  deleteProject: () => Promise<void>;
  fetcher: ReturnType<typeof useFetcher>;
}
