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

interface AuthPasswordFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'> {
  disabled?: boolean;
  onPasswordChange?: (value: string) => void;
}

export function AuthPasswordField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  disabled = false,
  onPasswordChange,
  ...props
}: AuthPasswordFieldProps<TFieldValues, TName>) {
  const t = useTranslations();

  return (
    <FormField<TFieldValues, TName>
      {...props}
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
