'use client';

import { AuthErrorMessage } from '@/auth-context/auth/presentation/components/molecules/auth-error-message/auth-error-message';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { Spinner } from '@repo/shared/presentation/components/ui/spinner';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
  isLoading: boolean;
  error: Error | null;
}

export function AuthCard({ children, isLoading, error }: AuthCardProps) {
  const t = useTranslations();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t('authPage.title.login')}
        </CardTitle>
        <CardDescription className="text-center">
          {t('authPage.description.login')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner className="mx-auto" /> : children}
        {error && <AuthErrorMessage error={error} />}
      </CardContent>
    </Card>
  );
}
