import { ROUTES } from '@/constants/routes';
import { HomePage, LoginPage, RegisterPage } from '@/router/lazy/router-lazy';
import { RouteObject } from 'react-router';

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    lazy: {
      element: HomePage,
    },
  },
  {
    path: ROUTES.REGISTER,
    lazy: {
      element: RegisterPage,
    },
  },
  {
    path: ROUTES.LOGIN,
    lazy: {
      element: LoginPage,
    },
  },
];
