import type { AuthLoginByEmailFormValues } from '@/auth-context/auth/presentation/dtos/schemas/auth-login-by-email';

export interface IAuthLoginServiceInput {
  credentials: AuthLoginByEmailFormValues;
  onSuccess: () => void;
  onError?: (error: Error) => void;
}

/**
 * Interface for login client (abstracts SDK dependency)
 */
export interface ILoginClient {
  loginByEmail: (input: {
    email: string;
    password: string;
  }) => Promise<{ accessToken: string; refreshToken: string } | null>;
}

/**
 * Application service for handling login business logic
 * Separates presentation concerns from business logic
 * Follows DDD pattern: Application layer service
 */
export class AuthLoginService {
  constructor(private readonly loginClient: ILoginClient) {}

  /**
   * Executes the login use case
   * @param input - Login credentials and callbacks
   */
  async execute(input: IAuthLoginServiceInput): Promise<void> {
    try {
      const result = await this.loginClient.loginByEmail({
        email: input.credentials.email,
        password: input.credentials.password,
      });

      if (result && result.accessToken) {
        input.onSuccess();
      }
    } catch (error) {
      const loginError =
        error instanceof Error ? error : new Error('Login failed');
      input.onError?.(loginError);
      throw loginError;
    }
  }
}
