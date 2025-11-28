'use client';

import { useTranslations } from 'next-intl';

interface AuthErrorMessageProps {
  error: Error | null;
}

export function AuthErrorMessage({ error }: AuthErrorMessageProps) {
  const t = useTranslations();

  if (!error) {
    return null;
  }

  return (
    <div className="text-sm text-destructive text-center">
      {error instanceof Error ? error.message : t('authPage.messages.error')}
    </div>
  );
}
