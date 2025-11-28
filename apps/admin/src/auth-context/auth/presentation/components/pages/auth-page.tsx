'use client';

import {
  AuthCard,
  AuthLoginForm,
  AuthSignupForm,
} from '@/auth-context/auth/presentation/components/organisms';
import type {
  AuthLoginByEmailFormValues,
  AuthRegisterByEmailFormValues,
} from '@/auth-context/auth/presentation/dtos/schemas';
import { useAuthPageStore } from '@/auth-context/auth/presentation/stores/auth-page-store';
import { useAuthStore } from '@/auth-context/auth/presentation/stores/auth-store';
import { useRoutes } from '@/shared/presentation/hooks/use-routes';
import { useAuth } from '@repo/sdk';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AuthPage = () => {
  const router = useRouter();
  const { routes } = useRoutes();
  const { isLogin, setIsLogin } = useAuthPageStore();
  const { setAccessToken, setRefreshToken, accessToken } = useAuthStore();
  const { loginByEmail, registerByEmail } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (accessToken) {
      router.push(routes.dashboard);
    }
  }, [accessToken, router, routes.dashboard]);

  const handleLoginSubmit = async (values: AuthLoginByEmailFormValues) => {
    try {
      const result = await loginByEmail.fetch({
        email: values.email,
        password: values.password,
      });

      if (result) {
        // Tokens are automatically saved by the SDK
        // Update local store as well
        setAccessToken(result.accessToken);
        setRefreshToken(result.refreshToken);

        // Clear password from store after successful login
        const { setPassword, setConfirmPassword } = useAuthPageStore.getState();
        setPassword('');
        setConfirmPassword('');

        // Redirect to dashboard
        router.push(routes.dashboard);
      }
    } catch (error) {
      // Error is handled by the hook state
      console.error('Login error:', error);
    }
  };

  const handleSignupSubmit = async (values: AuthRegisterByEmailFormValues) => {
    try {
      const result = await registerByEmail.fetch({
        email: values.email,
        password: values.password,
      });

      if (result && result.success) {
        // After successful registration, automatically log in
        const loginResult = await loginByEmail.fetch({
          email: values.email,
          password: values.password,
        });

        if (loginResult) {
          setAccessToken(loginResult.accessToken);
          setRefreshToken(loginResult.refreshToken);

          // Clear password from store after successful signup
          const { setPassword, setConfirmPassword } =
            useAuthPageStore.getState();
          setPassword('');
          setConfirmPassword('');

          // Redirect to dashboard
          router.push(routes.dashboard);
        }
      }
    } catch (error) {
      // Error is handled by the hook state
      console.error('Signup error:', error);
    }
  };

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    // Reset errors when switching
    loginByEmail.reset();
    registerByEmail.reset();
  };

  const isLoading = loginByEmail.loading || registerByEmail.loading;
  const error = loginByEmail.error || registerByEmail.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted/20 p-4">
      <AuthCard isLogin={isLogin} onSwitch={handleSwitch} isLoading={isLoading}>
        {isLogin ? (
          <AuthLoginForm
            onSubmit={handleLoginSubmit}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <AuthSignupForm
            onSubmit={handleSignupSubmit}
            isLoading={isLoading}
            error={error}
          />
        )}
      </AuthCard>
    </div>
  );
};

export default AuthPage;
