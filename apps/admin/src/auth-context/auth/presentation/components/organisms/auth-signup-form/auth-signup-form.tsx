'use client';

import {
  createAuthRegisterByEmailSchema,
  type AuthRegisterByEmailFormValues,
} from '@/auth-context/auth/presentation/dtos/schemas';
import { useAuthPageStore } from '@/auth-context/auth/presentation/stores/auth-page-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@repo/shared/presentation/components/ui/form';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AuthEmailField } from '../../molecules/auth-email-field/auth-email-field';
import { AuthPasswordField } from '../../molecules/auth-password-field/auth-password-field';
import { AuthConfirmPasswordField } from '../../molecules/auth-confirm-password-field/auth-confirm-password-field';
import { AuthErrorMessage } from '../../molecules/auth-error-message/auth-error-message';
import { AuthSubmitButton } from '../../molecules/auth-submit-button/auth-submit-button';

interface AuthSignupFormProps {
  onSubmit: (values: AuthRegisterByEmailFormValues) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function AuthSignupForm({
  onSubmit,
  isLoading,
  error,
}: AuthSignupFormProps) {
  const t = useTranslations();
  const {
    email,
    password,
    confirmPassword,
    setEmail,
    setPassword,
    setConfirmPassword,
  } = useAuthPageStore();

  // Create schema with translations
  const signupSchema = useMemo(
    () => createAuthRegisterByEmailSchema((key: string) => t(key)),
    [t],
  );

  // Signup form - initialized with store values
  const form = useForm<AuthRegisterByEmailFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AuthEmailField
          control={form.control}
          name="email"
          disabled={isLoading}
          onEmailChange={setEmail}
        />
        <AuthPasswordField
          control={form.control}
          name="password"
          disabled={isLoading}
          placeholderKey="signup"
          onPasswordChange={setPassword}
        />
        <AuthConfirmPasswordField
          control={form.control}
          name="confirmPassword"
          disabled={isLoading}
          onConfirmPasswordChange={setConfirmPassword}
        />
        <AuthErrorMessage error={error} />
        <AuthSubmitButton isLoading={isLoading} isLogin={false} />
      </form>
    </Form>
  );
}
