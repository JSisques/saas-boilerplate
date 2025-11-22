import type { MutationResponse } from '../../index.js';
import { useAsyncState } from '../../react/hooks/index.js';
import { useSDKContext } from '../../react/sdk-context.js';
import type { AuthLoginByEmailInput } from '../types/auth-login-by-email-input.type.js';
import type { AuthLogoutInput } from '../types/auth-logout-input.type.js';
import type { AuthRegisterByEmailInput } from '../types/auth-register-by-email-input.type.js';
import type { LoginResponse } from '../types/login-response.type.js';

/**
 * Hook for authentication operations
 */
export function useAuth() {
  const sdk = useSDKContext();

  const loginByEmail = useAsyncState<LoginResponse, [AuthLoginByEmailInput]>(
    (input: AuthLoginByEmailInput) => sdk.auth.loginByEmail(input),
  );

  const registerByEmail = useAsyncState<
    MutationResponse,
    [AuthRegisterByEmailInput]
  >((input: AuthRegisterByEmailInput) => sdk.auth.registerByEmail(input));

  const logout = useAsyncState<MutationResponse, [AuthLogoutInput]>(
    (input: AuthLogoutInput) => sdk.auth.logout(input),
  );

  return {
    loginByEmail: {
      ...loginByEmail,
      fetch: loginByEmail.execute,
    },
    registerByEmail: {
      ...registerByEmail,
      fetch: registerByEmail.execute,
    },
    logout: {
      ...logout,
      fetch: logout.execute,
    },
  };
}
