import { UserButton } from '@clerk/clerk-react';

export const UserChip = () => {
  return (
    <UserButton
      showName
      appearance={{
        elements: {
          rootBox: 'w-full',
          userButtonTrigger: '!shadow-none w-full justify-start p-2 rounded-md hover:bg-sidebar-accent',
          userButtonBox: 'flex-row-reverse shadow-none gap-2',
          userButtonOuterIdentifier: 'ps-0',
          popoverBox: 'pointer-events-auto',
        },
      }}
    />
  );
};
