import { GraphQLClient } from '@/shared/client/graphql-client';
import type { MutationResponse } from '@/shared/types/index';
import type {
  AuthLoginByEmailInput,
  AuthLogoutInput,
  AuthRegisterByEmailInput,
  LoginResponse,
} from './types/index.js';

export class AuthClient {
  constructor(private client: GraphQLClient) {}

  async loginByEmail(input: AuthLoginByEmailInput): Promise<LoginResponse> {
    const query = `
      mutation LoginByEmail($input: AuthLoginByEmailRequestDto!) {
        loginByEmail(input: $input) {
          accessToken
          refreshToken
        }
      }
    `;

    const result = await this.client.request<{ loginByEmail: LoginResponse }>({
      query,
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
    const query = `
      mutation RegisterByEmail($input: AuthRegisterByEmailRequestDto!) {
        registerByEmail(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{
      registerByEmail: MutationResponse;
    }>({
      query,
      variables: { input },
    });

    return result.registerByEmail;
  }

  async logout(input: AuthLogoutInput): Promise<MutationResponse> {
    const query = `
      mutation Logout($input: UpdateUserRequestDto!) {
        logout(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{ logout: MutationResponse }>({
      query,
      variables: { input },
    });

    return result.logout;
  }
}
