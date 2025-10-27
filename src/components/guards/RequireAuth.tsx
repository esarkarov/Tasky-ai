import { Loader } from '@/components/atoms/Loader';
import { ROUTES } from '@/constants/routes';
import { TIMING } from '@/constants/timing';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

export const RequireAuth = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to access this page.',
        duration: TIMING.TOAST_DURATION,
      });
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate, location, toast]);

  if (!isLoaded) {
    return <Loader />;
  }

  if (!isSignedIn) {
    return null;
  }

  return <Outlet />;
};
