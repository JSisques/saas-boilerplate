import { GraphQLClient } from '../../shared/client/graphql-client.js';
import type { MutationResponse } from '../../shared/types/index.js';
import {
  AUTH_LOGIN_BY_EMAIL_MUTATION,
  AUTH_LOGOUT_MUTATION,
  AUTH_REFRESH_TOKEN_MUTATION,
  AUTH_REGISTER_BY_EMAIL_MUTATION,
} from '../graphql/mutations/auth.mutations.js';
import type { AuthLoginByEmailInput } from '../types/auth-login-by-email-input.type.js';
import type { AuthLogoutInput } from '../types/auth-logout-input.type.js';
import type { AuthRefreshTokenInput } from '../types/auth-refresh-token-input.type.js';
import type { AuthRegisterByEmailInput } from '../types/auth-register-by-email-input.type.js';
import type { LoginResponse } from '../types/login-response.type.js';
import type { RefreshTokenResponse } from '../types/refresh-token-response.type.js';

export class AuthClient {
  constructor(private client: GraphQLClient) {}

  async loginByEmail(input: AuthLoginByEmailInput): Promise<LoginResponse> {
    const result = await this.client.request<{ loginByEmail: LoginResponse }>({
      query: AUTH_LOGIN_BY_EMAIL_MUTATION,
      variables: { input },
    });

    const loginResponse = result.loginByEmail;

    // Automatically save tokens to storage
    await this.client.setTokens(
      loginResponse.accessToken,
      loginResponse.refreshToken,
    );

    return loginResponse;
  }

  async registerByEmail(
    input: AuthRegisterByEmailInput,
  ): Promise<MutationResponse> {
    const result = await this.client.request<{
      registerByEmail: MutationResponse;
    }>({
      query: AUTH_REGISTER_BY_EMAIL_MUTATION,
      variables: { input },
    });

    return result.registerByEmail;
  }

  async refreshToken(
    input: AuthRefreshTokenInput,
  ): Promise<RefreshTokenResponse> {
    const result = await this.client.request<{
      refreshToken: RefreshTokenResponse;
    }>({
      query: AUTH_REFRESH_TOKEN_MUTATION,
      variables: { input },
    });

    const refreshResponse = result.refreshToken;

    // Automatically save the new access token to storage
    await this.client.setAccessToken(refreshResponse.accessToken);

    return refreshResponse;
  }

  async logout(input: AuthLogoutInput): Promise<MutationResponse> {
    const result = await this.client.request<{ logout: MutationResponse }>({
      query: AUTH_LOGOUT_MUTATION,
      variables: { input },
    });

    return result.logout;
  }
}
