import { GraphQLClient } from '../../shared/client/graphql-client.js';
import type { MutationResponse } from '../../shared/types/index.js';
import {
  TENANT_DATABASE_CREATE_MUTATION,
  TENANT_DATABASE_DELETE_MUTATION,
  TENANT_DATABASE_UPDATE_MUTATION,
} from '../graphql/mutations/tenant-database.mutations.js';
import {
  TENANT_DATABASE_FIND_BY_CRITERIA_QUERY,
  TENANT_DATABASE_FIND_BY_ID_QUERY,
} from '../graphql/queries/tenant-database.queries.js';
import type {
  PaginatedTenantDatabaseResult,
  TenantDatabaseCreateInput,
  TenantDatabaseDeleteInput,
  TenantDatabaseFindByCriteriaInput,
  TenantDatabaseFindByIdInput,
  TenantDatabaseResponse,
  TenantDatabaseUpdateInput,
} from '../index.js';

export class TenantDatabaseClient {
  constructor(private client: GraphQLClient) {}

  async findByCriteria(
    input?: TenantDatabaseFindByCriteriaInput,
  ): Promise<PaginatedTenantDatabaseResult> {
    const result = await this.client.request<{
      tenantDatabaseFindByCriteria: PaginatedTenantDatabaseResult;
    }>({
      query: TENANT_DATABASE_FIND_BY_CRITERIA_QUERY,
      variables: { input: input || {} },
    });

    return result.tenantDatabaseFindByCriteria;
  }

  async findById(
    input: TenantDatabaseFindByIdInput,
  ): Promise<TenantDatabaseResponse> {
    const result = await this.client.request<{
      tenantDatabaseFindById: TenantDatabaseResponse;
    }>({
      query: TENANT_DATABASE_FIND_BY_ID_QUERY,
      variables: { input },
    });

    return result.tenantDatabaseFindById;
  }

  async create(input: TenantDatabaseCreateInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      tenantDatabaseCreate: MutationResponse;
    }>({
      query: TENANT_DATABASE_CREATE_MUTATION,
      variables: { input },
    });

    return result.tenantDatabaseCreate;
  }

  async update(input: TenantDatabaseUpdateInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      tenantDatabaseUpdate: MutationResponse;
    }>({
      query: TENANT_DATABASE_UPDATE_MUTATION,
      variables: { input },
    });

    return result.tenantDatabaseUpdate;
  }

  async delete(input: TenantDatabaseDeleteInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      tenantDatabaseDelete: MutationResponse;
    }>({
      query: TENANT_DATABASE_DELETE_MUTATION,
      variables: { input },
    });

    return result.tenantDatabaseDelete;
  }
}
