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
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

interface AuthEmailFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'> {
  disabled?: boolean;
  onEmailChange?: (value: string) => void;
}

export function AuthEmailField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  disabled = false,
  onEmailChange,
  ...props
}: AuthEmailFieldProps<TFieldValues, TName>) {
  const t = useTranslations();

  return (
    <FormField<TFieldValues, TName>
      {...props}
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
