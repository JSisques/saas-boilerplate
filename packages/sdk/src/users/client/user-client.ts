import { GraphQLClient } from '../../shared/client/graphql-client.js';
import type { MutationResponse } from '../../shared/types/index.js';
import {
  USER_CREATE_MUTATION,
  USER_DELETE_MUTATION,
  USER_UPDATE_MUTATION,
} from '../graphql/mutations/users.mutations.js';
import {
  USER_FIND_BY_CRITERIA_QUERY,
  USER_FIND_BY_ID_QUERY,
} from '../graphql/queries/users.queries.js';
import type {
  CreateUserInput,
  DeleteUserInput,
  PaginatedUserResult,
  UpdateUserInput,
  UserFindByCriteriaInput,
  UserFindByIdInput,
  UserResponse,
} from '../index.js';

export class UserClient {
  constructor(private client: GraphQLClient) {}

  async findByCriteria(
    input?: UserFindByCriteriaInput,
  ): Promise<PaginatedUserResult> {
    const result = await this.client.request<{
      usersFindByCriteria: PaginatedUserResult;
    }>({
      query: USER_FIND_BY_CRITERIA_QUERY,
      variables: { input: input || {} },
    });

    return result.usersFindByCriteria;
  }

  async findById(input: UserFindByIdInput): Promise<UserResponse> {
    const result = await this.client.request<{ userFindById: UserResponse }>({
      query: USER_FIND_BY_ID_QUERY,
      variables: { input },
    });

    return result.userFindById;
  }

  async create(input: CreateUserInput): Promise<MutationResponse> {
    const result = await this.client.request<{ createUser: MutationResponse }>({
      query: USER_CREATE_MUTATION,
      variables: { input },
    });

    return result.createUser;
  }

  async update(input: UpdateUserInput): Promise<MutationResponse> {
    const result = await this.client.request<{ updateUser: MutationResponse }>({
      query: USER_UPDATE_MUTATION,
      variables: { input },
    });

    return result.updateUser;
  }

  async delete(input: DeleteUserInput): Promise<MutationResponse> {
    const result = await this.client.request<{ deleteUser: MutationResponse }>({
      query: USER_DELETE_MUTATION,
      variables: { input },
    });

    return result.deleteUser;
  }
}
