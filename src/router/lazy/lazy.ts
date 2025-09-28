import { createElement } from 'react';

export const RootLayout = async () => createElement((await import('@/components/layout/RootLayout')).default);
export const AppLayout = async () => createElement((await import('@/components/layout/AppLayout')).default);

export const HomePage = async () => createElement((await import('@/pages/HomePage')).default);
export const ErrorPage = async () => createElement((await import('@/pages/ErrorPage')).default);
export const LoginPage = async () => createElement((await import('@/pages/LoginPage')).default);
export const RegisterPage = async () => createElement((await import('@/pages/RegisterPage')).default);
export const AuthSyncPage = async () => createElement((await import('@/pages/AuthSyncPage')).default);
export const InboxPage = async () => createElement((await import('@/pages/InboxPage')).default);
export const TodayPage = async () => createElement((await import('@/pages/TodayPage')).default);
export const UpcomingPage = async () => createElement((await import('@/pages/UpcomingPage')).default);
export const CompletedPage = async () => createElement((await import('@/pages/CompletedPage')).default);
export const ProjectsPage = async () => createElement((await import('@/pages/ProjectsPage')).default);

export const taskAction = async () => (await import('@/router/actions/taskAction')).default;
export const projectAction = async () => (await import('@/router/actions/projectAction')).default;

export const appLoader = async () => (await import('@/router/loaders/appLoader')).default;
export const completedLoader = async () => (await import('@/router/loaders/completedLoader')).default;
export const inboxLoader = async () => (await import('@/router/loaders/inboxLoader')).default;
export const projectsLoader = async () => (await import('@/router/loaders/projectsLoader')).default;
export const todayLoader = async () => (await import('@/router/loaders/todayLoader')).default;
export const upcomingLoader = async () => (await import('@/router/loaders/upcomingLoader')).default;
