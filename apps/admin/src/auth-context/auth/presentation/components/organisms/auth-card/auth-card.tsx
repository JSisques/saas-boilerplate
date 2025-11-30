'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
  isLoading?: boolean;
}

export function AuthCard({ children, isLoading = false }: AuthCardProps) {
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
      <CardContent>{children}</CardContent>
    </Card>
  );
}
