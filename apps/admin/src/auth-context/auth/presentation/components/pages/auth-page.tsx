'use client';

import { AuthCard } from '@/auth-context/auth/presentation/components/organisms/auth-card/auth-card';
import { AuthLoginForm } from '@/auth-context/auth/presentation/components/organisms/auth-login-form/auth-login-form';
import { useAuthLogin } from '@/auth-context/auth/presentation/hooks/use-auth-login/use-auth-login';

/**
 * Authentication page component
 * Uses application service through useAuthLogin hook (DDD pattern)
 */
const AuthPage = () => {
  const { handleLogin, isLoading, error } = useAuthLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted/20 p-4">
      <AuthCard isLoading={isLoading}>
        <AuthLoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
        />
      </AuthCard>
    </div>
  );
};

export default AuthPage;
