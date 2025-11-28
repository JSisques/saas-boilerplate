'use client';

import { Button } from '@repo/shared/presentation/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AuthSubmitButtonProps {
  isLoading: boolean;
  isLogin: boolean;
  disabled?: boolean;
}

export function AuthSubmitButton({
  isLoading,
  isLogin,
  disabled = false,
}: AuthSubmitButtonProps) {
  const t = useTranslations();

  return (
    <Button type="submit" className="w-full" disabled={disabled || isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t(`authPage.actions.loading.${isLogin ? 'login' : 'signup'}`)}
        </>
      ) : (
        t(`authPage.actions.${isLogin ? 'login' : 'signup'}`)
      )}
    </Button>
  );
}
