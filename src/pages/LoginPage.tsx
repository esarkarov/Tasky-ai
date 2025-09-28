import { Head } from '@/components/shared/Head';
import { ROUTES } from '@/constants';
import { SignIn } from '@clerk/clerk-react';

const LoginPage = () => {
  return (
    <>
      <Head title="Tasky AI | Log In" />

      <section>
        <div className="container flex justify-center">
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
        </div>
      </section>
    </>
  );
};

export default LoginPage;
