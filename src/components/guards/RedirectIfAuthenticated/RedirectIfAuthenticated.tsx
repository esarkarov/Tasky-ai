import { Loader } from '@/components/atoms/Loader';
import { ROUTES } from '@/constants/routes';
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
