import { GraphQLClient } from '../../shared/client/graphql-client';
import type { MutationResponse } from '../../shared/types/index';
import {
  TENANT_CREATE_MUTATION,
  TENANT_DELETE_MUTATION,
  TENANT_UPDATE_MUTATION,
} from '../graphql/mutations/tenant.mutations';
import {
  TENANT_FIND_BY_CRITERIA_QUERY,
  TENANT_FIND_BY_ID_QUERY,
} from '../graphql/queries/tenant.queries';
import type { PaginatedTenantResult } from '../types/paginated-tenant-result.type';
import type { TenantCreateInput } from '../types/tenant-create-input.type';
import type { TenantDeleteInput } from '../types/tenant-delete-input.type';
import type { TenantFindByCriteriaInput } from '../types/tenant-find-by-criteria-input.type';
import type { TenantFindByIdInput } from '../types/tenant-find-by-id-input.type';
import type { TenantResponse } from '../types/tenant-response.type';
import type { TenantUpdateInput } from '../types/tenant-update-input.type';

export class TenantClient {
  constructor(private client: GraphQLClient) {}

  /**
   * Finds tenants by search/filter criteria.
   * @param input Optional criteria to filter tenants.
   * @returns A paginated result of tenants that match the criteria.
   */
  async findByCriteria(
    input?: TenantFindByCriteriaInput,
  ): Promise<PaginatedTenantResult> {
    const result = await this.client.request<{
      tenantFindByCriteria: PaginatedTenantResult;
    }>({
      query: TENANT_FIND_BY_CRITERIA_QUERY,
      variables: { input: input || {} },
    });

    return result.tenantFindByCriteria;
  }

  /**
   * Finds a tenant by its unique identifier.
   * @param input The `TenantFindByIdInput` object containing the tenant's ID.
   * @returns The tenant object if found.
   */
  async findById(input: TenantFindByIdInput): Promise<TenantResponse> {
    const result = await this.client.request<{
      tenantFindById: TenantResponse;
    }>({
      query: TENANT_FIND_BY_ID_QUERY,
      variables: { input },
    });

    return result.tenantFindById;
  }

  /**
   * Creates a new tenant.
   * @param input The data for the new tenant.
   * @returns The mutation response indicating success or failure.
   */
  async create(input: TenantCreateInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      tenantCreate: MutationResponse;
    }>({
      query: TENANT_CREATE_MUTATION,
      variables: { input },
    });

    return result.tenantCreate;
  }

  /**
   * Updates an existing tenant.
   * @param input The update information for the tenant.
   * @returns The mutation response indicating success or failure.
   */
  async update(input: TenantUpdateInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      tenantUpdate: MutationResponse;
    }>({
      query: TENANT_UPDATE_MUTATION,
      variables: { input },
    });

    return result.tenantUpdate;
  }

  /**
   * Deletes a tenant.
   * @param input The object containing the ID of the tenant to delete.
   * @returns The mutation response indicating success or failure.
   */
  async delete(input: TenantDeleteInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      tenantDelete: MutationResponse;
    }>({
      query: TENANT_DELETE_MUTATION,
      variables: { input },
    });

    return result.tenantDelete;
  }
}
