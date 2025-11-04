import { GraphQLClient } from '@/shared/client/graphql-client';
import type { MutationResponse } from '@/shared/types/index';
import type {
  CreateUserInput,
  DeleteUserInput,
  PaginatedUserResult,
  UpdateUserInput,
  UserFindByCriteriaInput,
  UserFindByIdInput,
  UserResponse,
} from '@/user-context/types/index';

export class UserClient {
  constructor(private client: GraphQLClient) {}

  async findByCriteria(
    input?: UserFindByCriteriaInput,
  ): Promise<PaginatedUserResult> {
    const query = `
      query UsersFindByCriteria($input: UserFindByCriteriaRequestDto) {
        usersFindByCriteria(input: $input) {
          total
          page
          perPage
          totalPages
          items {
            id
            userName
            lastName
            role
            status
            avatarUrl
            bio
            name
          }
        }
      }
    `;

    const result = await this.client.request<{
      usersFindByCriteria: PaginatedUserResult;
    }>({
      query,
      variables: { input: input || {} },
    });

    return result.usersFindByCriteria;
  }

  async findById(input: UserFindByIdInput): Promise<UserResponse> {
    const query = `
      query UserFindById($input: UserFindByIdRequestDto!) {
        userFindById(input: $input) {
          id
          userName
          lastName
          role
          status
          avatarUrl
          bio
          name
        }
      }
    `;

    const result = await this.client.request<{ userFindById: UserResponse }>({
      query,
      variables: { input },
    });

    return result.userFindById;
  }

  async create(input: CreateUserInput): Promise<MutationResponse> {
    const query = `
      mutation CreateUser($input: CreateUserRequestDto!) {
        createUser(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{ createUser: MutationResponse }>({
      query,
      variables: { input },
    });

    return result.createUser;
  }

  async update(input: UpdateUserInput): Promise<MutationResponse> {
    const query = `
      mutation UpdateUser($input: UpdateUserRequestDto!) {
        updateUser(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{ updateUser: MutationResponse }>({
      query,
      variables: { input },
    });

    return result.updateUser;
  }

  async delete(input: DeleteUserInput): Promise<MutationResponse> {
    const query = `
      mutation DeleteUser($input: DeleteUserRequestDto!) {
        deleteUser(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{ deleteUser: MutationResponse }>({
      query,
      variables: { input },
    });

    return result.deleteUser;
  }
}
