'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/shared/presentation/components/ui/form';
import { Input } from '@repo/shared/presentation/components/ui/input';
import { useTranslations } from 'next-intl';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface AuthConfirmPasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  disabled?: boolean;
  onConfirmPasswordChange?: (value: string) => void;
}

export function AuthConfirmPasswordField<T extends FieldValues>({
  control,
  name,
  disabled = false,
  onConfirmPasswordChange,
}: AuthConfirmPasswordFieldProps<T>) {
  const t = useTranslations();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('authPage.fields.confirmPassword.label')}</FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder={t('authPage.fields.confirmPassword.placeholder')}
              disabled={disabled}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onConfirmPasswordChange?.(e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
