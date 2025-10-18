import { ToasterToast } from '@/hooks/use-toast';

export interface ToastMessages {
  loading: string;
  success: string;
  error: string;
  errorDescription: string;
}

export interface ToastHandler {
  id: string;
  dismiss: () => void;
  update: (options: ToasterToast & { id: string }) => void;
}
