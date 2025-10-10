import { Head } from '@/components/atoms/Head';
import { ROUTES } from '@/constants/routes';
import { SignIn } from '@clerk/clerk-react';

export const LoginPage = () => {
  return (
    <>
      <Head title="Tasky AI | Log In" />

      <main
        role="main"
        aria-labelledby="login-page-title"
        className="flex justify-center py-12">
        <h1
          id="login-page-title"
          className="sr-only">
          Log in to Tasky AI
        </h1>

        <SignIn
          routing="path"
          path={ROUTES.LOGIN}
          signUpUrl={ROUTES.REGISTER}
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-lg',
            },
          }}
        />
      </main>
    </>
  );
};
