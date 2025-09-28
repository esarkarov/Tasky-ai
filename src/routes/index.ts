import { ROUTES } from '@/constants';
import ErrorPage from '@/pages/ErrorPage';
import { AppLayout, appLoader, RootLayout, taskAction } from '@/routes/lazy';
import { appRoutes } from '@/routes/modules/appRoutes';
import { publicRoutes } from '@/routes/modules/publicRoutes';
import { createElement } from 'react';
import { createBrowserRouter } from 'react-router';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    children: publicRoutes,
    errorElement: createElement(ErrorPage),
    lazy: {
      element: RootLayout,
    },
  },
  {
    path: ROUTES.APP,
    children: appRoutes,
    errorElement: createElement(ErrorPage),
    lazy: {
      element: AppLayout,
      action: taskAction,
      loader: appLoader,
    },
  },
  {
    path: ROUTES.NOT_FOUND,
    errorElement: createElement(ErrorPage),
  },
]);

export default router;
