'use client';

import { useTranslations } from 'next-intl';

interface AuthSwitchButtonProps {
  isLogin: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function AuthSwitchButton({
  isLogin,
  disabled = false,
  onClick,
}: AuthSwitchButtonProps) {
  const t = useTranslations();

  return (
    <div className="text-sm text-center text-muted-foreground">
      {isLogin
        ? `${t('authPage.messages.switchToSignup')} `
        : `${t('authPage.messages.switchToLogin')} `}
      <button
        type="button"
        onClick={onClick}
        className="text-primary hover:underline font-medium"
        disabled={disabled}
      >
        {isLogin
          ? t('authPage.actions.switchToSignup')
          : t('authPage.actions.switchToLogin')}
      </button>
    </div>
  );
}
