import { Loader } from '@/components/atoms/Loader';
import { ROUTES } from '@/constants/routes';
import { TIMING } from '@/constants/timing';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

export const RedirectIfAuthenticated = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate(ROUTES.TODAY, { replace: true });
      toast({
        title: `Welcome back, ${user?.firstName}!`,
        description: 'You have successfully signed in.',
        duration: TIMING.TOAST_DURATION,
      });
    }
  }, [isLoaded, isSignedIn, navigate, toast, user?.firstName]);

  if (!isLoaded) {
    return <Loader />;
  }

  if (isSignedIn) {
    return null;
  }

  return <Outlet />;
};
