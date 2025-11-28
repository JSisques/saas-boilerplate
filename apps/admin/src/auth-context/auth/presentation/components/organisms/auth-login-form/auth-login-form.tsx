'use client';

import {
  createAuthLoginByEmailSchema,
  type AuthLoginByEmailFormValues,
} from '@/auth-context/auth/presentation/dtos/schemas';
import { useAuthPageStore } from '@/auth-context/auth/presentation/stores/auth-page-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@repo/shared/presentation/components/ui/form';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AuthEmailField } from '../../molecules/auth-email-field/auth-email-field';
import { AuthPasswordField } from '../../molecules/auth-password-field/auth-password-field';
import { AuthErrorMessage } from '../../molecules/auth-error-message/auth-error-message';
import { AuthSubmitButton } from '../../molecules/auth-submit-button/auth-submit-button';

interface AuthLoginFormProps {
  onSubmit: (values: AuthLoginByEmailFormValues) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function AuthLoginForm({
  onSubmit,
  isLoading,
  error,
}: AuthLoginFormProps) {
  const t = useTranslations();
  const { email, password, setEmail, setPassword } = useAuthPageStore();

  // Create schema with translations
  const loginSchema = useMemo(
    () => createAuthLoginByEmailSchema((key: string) => t(key)),
    [t],
  );

  // Login form - initialized with store values
  const form = useForm<AuthLoginByEmailFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: email,
      password: password,
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
          placeholderKey="login"
          onPasswordChange={setPassword}
        />
        <AuthErrorMessage error={error} />
        <AuthSubmitButton isLoading={isLoading} isLogin={true} />
      </form>
    </Form>
  );
}
