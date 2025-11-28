import { z } from 'zod';

/**
 * Schema factory for auth register by email form validation
 * Following DDD principles, this schema is isolated in its own module
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for signup form validation
 */
export function createAuthRegisterByEmailSchema(
  translations: (key: string) => string,
) {
  return z
    .object({
      email: z
        .string()
        .min(1, translations('authPage.validation.email.required'))
        .email(translations('authPage.validation.email.invalid')),
      password: z
        .string()
        .min(1, translations('authPage.validation.password.required'))
        .min(8, translations('authPage.validation.password.minLength')),
      confirmPassword: z
        .string()
        .min(1, translations('authPage.validation.confirmPassword.required')),
    })
    .refine(
      (data: { password: string; confirmPassword: string }) =>
        data.password === data.confirmPassword,
      {
        message: translations('authPage.validation.confirmPassword.mismatch'),
        path: ['confirmPassword'],
      },
    );
}

export type AuthRegisterByEmailFormValues = z.infer<
  ReturnType<typeof createAuthRegisterByEmailSchema>
>;
