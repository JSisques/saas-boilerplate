'use client';
import { useCallback } from 'react';
import type {
  AuthLoginByEmailInput,
  AuthRegisterByEmailInput,
  LoginResponse,
} from '../../auth/types/index.js';
import type { SDK } from '../../index.js';
import type { MutationResponse } from '../../shared/types/index.js';
import { useAsyncState } from './use-async-state.js';

/**
 * Hook for authentication operations
 */
export function useAuth(sdk: SDK) {
  const login = useAsyncState<LoginResponse, [AuthLoginByEmailInput]>(
    (input: AuthLoginByEmailInput) => sdk.auth.loginByEmail(input),
  );

  const register = useAsyncState<MutationResponse, [AuthRegisterByEmailInput]>(
    (input: AuthRegisterByEmailInput) => sdk.auth.registerByEmail(input),
  );

  const logout = useAsyncState<MutationResponse, [{ id: string }]>(
    (input: { id: string }) => sdk.auth.logout(input),
  );

  const loginByEmail = useCallback(
    async (input: AuthLoginByEmailInput) => {
      const result = await login.execute(input);
      return result;
    },
    [login],
  );

  const registerByEmail = useCallback(
    async (input: AuthRegisterByEmailInput) => {
      const result = await register.execute(input);
      return result;
    },
    [register],
  );

  const logoutUser = useCallback(
    async (input: { id: string }) => {
      try {
        const result = await logout.execute(input);
        // Clear tokens after logout
        await sdk.logout();
        return result;
      } catch (error) {
        // Even if logout fails, clear tokens
        await sdk.logout();
        throw error;
      }
    },
    [logout, sdk],
  );

  return {
    login: {
      ...login,
      execute: loginByEmail,
    },
    register: {
      ...register,
      execute: registerByEmail,
    },
    logout: {
      ...logout,
      execute: logoutUser,
    },
  };
}
