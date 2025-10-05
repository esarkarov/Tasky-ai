import { Loader } from '@/components/atoms/Loader';
import { ROUTES } from '@/constants/routes';
import ErrorPage from '@/pages/ErrorPage';
import { appLoader, AppTemplate, RootTemplate, taskAction } from '@/router/lazy/lazy';
import { protectedRoutes } from '@/router/routes/protectedRoutes';
import { publicRoutes } from '@/router/routes/publicRoutes';
import { createElement } from 'react';
import { createBrowserRouter } from 'react-router';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    errorElement: createElement(ErrorPage),
    hydrateFallbackElement: createElement(Loader),
    lazy: {
      element: RootTemplate,
    },
    children: publicRoutes,
  },
  {
    path: ROUTES.APP,
    errorElement: createElement(ErrorPage),
    hydrateFallbackElement: createElement(Loader),
    lazy: {
      element: AppTemplate,
      action: taskAction,
      loader: appLoader,
    },
    children: protectedRoutes,
  },
  {
    path: ROUTES.NOT_FOUND,
    lazy: async () => ({
      Component: ErrorPage,
    }),
  },
]);

export default router;
