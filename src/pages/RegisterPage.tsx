import { Head } from '@/components/shared/Head';
import { ROUTES } from '@/constants';
import { SignUp } from '@clerk/clerk-react';

const RegisterPage = () => {
  return (
    <>
      <Head title="Tasky AI | Create an Account" />

      <section>
        <div className="container flex justify-center">
          <SignUp
            routing="path"
            path={ROUTES.REGISTER}
            signInUrl={ROUTES.LOGIN}
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

export default RegisterPage;
