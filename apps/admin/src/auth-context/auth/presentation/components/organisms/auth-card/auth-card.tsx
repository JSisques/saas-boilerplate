'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { AuthSwitchButton } from '../../molecules/auth-switch-button/auth-switch-button';

interface AuthCardProps {
  isLogin: boolean;
  children: ReactNode;
  onSwitch: () => void;
  isLoading?: boolean;
}

export function AuthCard({
  isLogin,
  children,
  onSwitch,
  isLoading = false,
}: AuthCardProps) {
  const t = useTranslations();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isLogin ? t('authPage.title.login') : t('authPage.title.signup')}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin
            ? t('authPage.description.login')
            : t('authPage.description.signup')}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <AuthSwitchButton
          isLogin={isLogin}
          onClick={onSwitch}
          disabled={isLoading}
        />
      </CardFooter>
    </Card>
  );
}
