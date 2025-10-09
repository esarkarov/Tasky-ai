import { createElement } from 'react';

export const RootTemplate = async () =>
  createElement((await import('@/components/templates/RootTemplate/RootTemplate')).RootTemplate);
export const AppTemplate = async () =>
  createElement((await import('@/components/templates/AppTemplate/AppTemplate')).AppTemplate);

export const HomePage = async () => createElement((await import('@/pages/HomePage')).HomePage);
export const ErrorPage = async () => createElement((await import('@/pages/ErrorPage')).ErrorPage);
export const LoginPage = async () => createElement((await import('@/pages/LoginPage')).LoginPage);
export const RegisterPage = async () => createElement((await import('@/pages/RegisterPage')).RegisterPage);
export const AuthSyncPage = async () => createElement((await import('@/pages/AuthSyncPage')).AuthSyncPage);
export const InboxPage = async () => createElement((await import('@/pages/InboxPage')).InboxPage);
export const TodayPage = async () => createElement((await import('@/pages/TodayPage')).TodayPage);
export const UpcomingPage = async () => createElement((await import('@/pages/UpcomingPage')).UpcomingPage);
export const CompletedPage = async () => createElement((await import('@/pages/CompletedPage')).CompletedPage);
export const ProjectsPage = async () => createElement((await import('@/pages/ProjectsPage')).ProjectsPage);
export const ProjectDetailPage = async () =>
  createElement((await import('@/pages/ProjectDetailPage')).ProjectDetailPage);

export const taskAction = async () => (await import('@/router/actions/taskAction')).taskAction;
export const projectAction = async () => (await import('@/router/actions/projectAction')).projectAction;

export const appLoader = async () => (await import('@/router/loaders/appLoader')).appLoader;
export const completedLoader = async () => (await import('@/router/loaders/completedLoader')).completedLoader;
export const inboxLoader = async () => (await import('@/router/loaders/inboxLoader')).inboxLoader;
export const projectsLoader = async () => (await import('@/router/loaders/projectsLoader')).projectsLoader;
export const todayLoader = async () => (await import('@/router/loaders/todayLoader')).todayLoader;
export const upcomingLoader = async () => (await import('@/router/loaders/upcomingLoader')).upcomingLoader;
export const projectDetailLoader = async () =>
  (await import('@/router/loaders/projectDetailLoader')).projectDetailLoader;
