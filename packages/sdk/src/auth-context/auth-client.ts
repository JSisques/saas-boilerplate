import type {
  AuthLoginByEmailInput,
  AuthLogoutInput,
  AuthRegisterByEmailInput,
  LoginResponse,
} from '@/auth-context/types/index';
import { GraphQLClient } from '@/shared/client/graphql-client';
import type { MutationResponse } from '@/shared/types/index';

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

    return result.loginByEmail;
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
