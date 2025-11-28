import { z } from 'zod';

/**
 * Schema factory for auth login by email form validation
 * Following DDD principles, this schema is isolated in its own module
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for login form validation
 */
export function createAuthLoginByEmailSchema(
  translations: (key: string) => string,
) {
  return z.object({
    email: z
      .string()
      .min(1, translations('authPage.validation.email.required'))
      .email(translations('authPage.validation.email.invalid')),
    password: z
      .string()
      .min(1, translations('authPage.validation.password.required'))
      .min(8, translations('authPage.validation.password.minLength')),
  });
}

export type AuthLoginByEmailFormValues = z.infer<
  ReturnType<typeof createAuthLoginByEmailSchema>
>;
