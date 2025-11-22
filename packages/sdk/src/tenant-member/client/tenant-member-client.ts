import { GraphQLClient } from '../../shared/client/graphql-client.js';
import { MutationResponse } from '../../shared/types/index.js';
import {
  TENANT_MEMBER_ADD_MUTATION,
  TENANT_MEMBER_REMOVE_MUTATION,
  TENANT_MEMBER_UPDATE_MUTATION,
} from '../graphql/mutations/tenant-member.mutations.js';
import {
  TENANT_MEMBER_FIND_BY_CRITERIA_QUERY,
  TENANT_MEMBER_FIND_BY_ID_QUERY,
} from '../graphql/queries/tenant-member.queries.js';
import { PaginatedTenantMemberResult } from '../types/paginated-tenant-member-result.type.js';
import { TenantMemberAddInput } from '../types/tenant-member-add-input.type.js';
import { TenantMemberFindByCriteriaInput } from '../types/tenant-member-find-by-criteria-input.type.js';
import { TenantMemberFindByIdInput } from '../types/tenant-member-find-by-id-input.type.js';
import { TenantMemberRemoveInput } from '../types/tenant-member-remove-input.type.js';
import { TenantMemberResponse } from '../types/tenant-member-response.type.js';
import { TenantMemberUpdateInput } from '../types/tenant-member-update-input.type.js';

export class TenantMemberClient {
  constructor(private client: GraphQLClient) {}

  /**
   * Finds tenant members by criteria.
   * @param input - The criteria for filtering tenant members (optional).
   * @returns A paginated result of tenant members matching the criteria.
   */
  async findByCriteria(
    input?: TenantMemberFindByCriteriaInput,
  ): Promise<PaginatedTenantMemberResult> {
    const result = await this.client.request<{
      tenantMemberFindByCriteria: PaginatedTenantMemberResult;
    }>({
      query: TENANT_MEMBER_FIND_BY_CRITERIA_QUERY,
      variables: { input: input || {} },
    });

    return result.tenantMemberFindByCriteria;
  }

  /**
   * Finds a tenant member by their unique ID.
   * @param input - An object containing the ID of the tenant member to find.
   * @returns The tenant member response if found.
   */
  async findById(
    input: TenantMemberFindByIdInput,
  ): Promise<TenantMemberResponse> {
    const result = await this.client.request<{
      tenantMemberFindById: TenantMemberResponse;
    }>({
      query: TENANT_MEMBER_FIND_BY_ID_QUERY,
      variables: { input: input || {} },
    });
    return result.tenantMemberFindById;
  }

  /**
   * Adds a new tenant member.
   * @param input - The input data for the tenant member to add.
   * @returns The result of the mutation, including the new member's ID on success.
   */
  async add(input: TenantMemberAddInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      tenantMemberAdd: MutationResponse;
    }>({
      query: TENANT_MEMBER_ADD_MUTATION,
      variables: { input },
    });

    return result.tenantMemberAdd;
  }

  /**
   * Updates an existing tenant member.
   * @param input - The input data for the tenant member update.
   * @returns The result of the update mutation.
   */
  async update(input: TenantMemberUpdateInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      tenantMemberUpdate: MutationResponse;
    }>({
      query: TENANT_MEMBER_UPDATE_MUTATION,
      variables: { input },
    });

    return result.tenantMemberUpdate;
  }

  /**
   * Removes a tenant member.
   * @param input - An object containing the ID of the tenant member to remove.
   * @returns The result of the remove mutation.
   */
  async remove(input: TenantMemberRemoveInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      tenantMemberRemove: MutationResponse;
    }>({
      query: TENANT_MEMBER_REMOVE_MUTATION,
      variables: { input },
    });

    return result.tenantMemberRemove;
  }
}
