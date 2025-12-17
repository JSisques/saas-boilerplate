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

interface AuthEmailFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  disabled?: boolean;
  onEmailChange?: (value: string) => void;
}

export function AuthEmailField<T extends FieldValues>({
  control,
  name,
  disabled = false,
  onEmailChange,
}: AuthEmailFieldProps<T>) {
  const t = useTranslations();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('authPage.fields.email.label')}</FormLabel>
          <FormControl>
            <Input
              type="email"
              placeholder={t('authPage.fields.email.placeholder')}
              disabled={disabled}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onEmailChange?.(e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
