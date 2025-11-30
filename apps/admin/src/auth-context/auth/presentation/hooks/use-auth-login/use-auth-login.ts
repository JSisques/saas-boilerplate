import { AuthLoginService } from '@/auth-context/auth/application/services/auth-login/auth-login.service';
import type { AuthLoginByEmailFormValues } from '@/auth-context/auth/presentation/dtos/schemas/auth-login-by-email';
import { useRoutes } from '@/shared/presentation/hooks/use-routes';
import { useAuth } from '@repo/sdk';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Hook that provides login functionality using the AuthLoginService
 * Connects presentation layer to application layer following DDD pattern
 */
export function useAuthLogin() {
  const router = useRouter();
  const { routes } = useRoutes();
  const { loginByEmail } = useAuth();

  // Create service instance with SDK login client
  const loginService = useMemo(
    () =>
      new AuthLoginService({
        loginByEmail: async (input) => {
          const result = await loginByEmail.fetch(input);
          return result || null;
        },
      }),
    [loginByEmail],
  );

  const handleLogin = async (values: AuthLoginByEmailFormValues) => {
    await loginService.execute({
      credentials: values,
      onSuccess: () => {
        router.push(routes.dashboard);
      },
      onError: (error) => {
        // Error handling is delegated to the SDK hook state
        console.error('Login error:', error);
      },
    });
  };

  return {
    handleLogin,
    isLoading: loginByEmail.loading,
    error: loginByEmail.error,
  };
}
