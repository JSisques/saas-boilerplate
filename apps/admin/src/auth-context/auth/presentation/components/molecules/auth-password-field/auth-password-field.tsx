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

interface AuthPasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  disabled?: boolean;
  onPasswordChange?: (value: string) => void;
}

export function AuthPasswordField<T extends FieldValues>({
  control,
  name,
  disabled = false,
  onPasswordChange,
}: AuthPasswordFieldProps<T>) {
  const t = useTranslations();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('authPage.fields.password.label')}</FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder={t('authPage.fields.password.placeholder')}
              disabled={disabled}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onPasswordChange?.(e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
