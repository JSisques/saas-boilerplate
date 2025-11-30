'use client';

import { AuthCard } from '@/auth-context/auth/presentation/components/organisms/auth-card/auth-card';
import { AuthLoginForm } from '@/auth-context/auth/presentation/components/organisms/auth-login-form/auth-login-form';
import type { AuthLoginByEmailFormValues } from '@/auth-context/auth/presentation/dtos/schemas/auth-login-by-email';
import { useRoutes } from '@/shared/presentation/hooks/use-routes';
import { useAuth } from '@repo/sdk';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const router = useRouter();
  const { routes } = useRoutes();
  const { loginByEmail } = useAuth();

  const handleLoginSubmit = async (values: AuthLoginByEmailFormValues) => {
    try {
      const result = await loginByEmail.fetch({
        email: values.email,
        password: values.password,
      });

      if (result && result.accessToken) {
        // Redirect to dashboard
        router.push(routes.dashboard);
      }
    } catch (error) {
      // Error is handled by the hook state
      console.error('Login error:', error);
    }
  };

  const isLoading = loginByEmail.loading;
  const error = loginByEmail.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted/20 p-4">
      <AuthCard isLoading={isLoading}>
        <AuthLoginForm
          onSubmit={handleLoginSubmit}
          isLoading={isLoading}
          error={error}
        />
      </AuthCard>
    </div>
  );
};

export default AuthPage;
