import { env } from '@/config/env';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const AuthSyncPage = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded, userId } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      if (sessionStorage.getItem(env.clerkUserStorageKey)) {
        sessionStorage.removeItem(env.clerkUserStorageKey);
      }

      navigate(ROUTES.HOME);
      return;
    }

    if (isSignedIn) {
      sessionStorage.setItem(env.clerkUserStorageKey, userId);
      navigate(ROUTES.TODAY);
    }
  }, [userId, isSignedIn, isLoaded, navigate]);

  return <></>;
};

export default AuthSyncPage;
