import { Loader } from '@/components/shared/Loader';
import { ROUTES } from '@/constants';
import ErrorPage from '@/pages/ErrorPage';
import { AppLayout, appLoader, RootLayout, taskAction } from '@/router/lazy/lazy';
import { appRoutes } from '@/router/routes/appRoutes';
import { publicRoutes } from '@/router/routes/publicRoutes';
import { createElement } from 'react';
import { createBrowserRouter } from 'react-router';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    errorElement: createElement(ErrorPage),
    hydrateFallbackElement: createElement(Loader),
    lazy: {
      element: RootLayout,
    },
    children: publicRoutes,
  },
  {
    path: ROUTES.APP,
    errorElement: createElement(ErrorPage),
    hydrateFallbackElement: createElement(Loader),
    lazy: {
      element: AppLayout,
      action: taskAction,
      loader: appLoader,
    },
    children: appRoutes,
  },
  {
    path: ROUTES.NOT_FOUND,
    lazy: async () => ({
      Component: ErrorPage,
    }),
  },
]);

export default router;
