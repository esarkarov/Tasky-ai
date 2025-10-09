import { Calendar1, CalendarDays, CircleCheck, Inbox } from 'lucide-react';

export const SOCIAL_LINKS = [
  {
    href: 'https://linkedin.com/in/elvinsarkarov',
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/esarkarov',
    label: 'GitHub',
  },
] as const;

export const TASK_SIDEBAR_LINKS = [
  {
    href: '/app/inbox',
    label: 'Inbox',
    icon: Inbox,
  },
  {
    href: '/app/today',
    label: 'Today',
    icon: Calendar1,
  },
  {
    href: '/app/upcoming',
    label: 'Upcoming',
    icon: CalendarDays,
  },
  {
    href: '/app/completed',
    label: 'Completed',
    icon: CircleCheck,
  },
] as const;
