import { ToasterToast } from '@/hooks/use-toast';

export interface ToastMessages {
  LOADING: string;
  SUCCESS: string;
  ERROR: string;
  ERROR_DESC: string;
}

export type ToastHandler = {
  id: string;
  dismiss: () => void;
  update: (options: ToasterToast & { id: string }) => void;
};
