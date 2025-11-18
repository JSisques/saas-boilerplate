import { GraphQLClient } from '@/shared/client/graphql-client';
import type { MutationResponse } from '@/shared/types/index';
import type {
  PaginatedTenantMemberResult,
  TenantMemberAddInput,
  TenantMemberFindByCriteriaInput,
  TenantMemberRemoveInput,
  TenantMemberUpdateInput,
} from '@/tenant/types/index';

export class TenantMemberClient {
  constructor(private client: GraphQLClient) {}

  async findByCriteria(
    input?: TenantMemberFindByCriteriaInput,
  ): Promise<PaginatedTenantMemberResult> {
    const query = `
      query TenantMemberFindByCriteria($input: TenantMemberFindByCriteriaRequestDto) {
        tenantMemberFindByCriteria(input: $input) {
          total
          page
          perPage
          totalPages
          items {
            id
            tenantId
            userId
            role
          }
        }
      }
    `;

    const result = await this.client.request<{
      tenantMemberFindByCriteria: PaginatedTenantMemberResult;
    }>({
      query,
      variables: { input: input || {} },
    });

    return result.tenantMemberFindByCriteria;
  }

  async add(input: TenantMemberAddInput): Promise<MutationResponse> {
    const query = `
      mutation TenantMemberAdd($input: TenantMemberAddRequestDto!) {
        tenantMemberAdd(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{
      tenantMemberAdd: MutationResponse;
    }>({
      query,
      variables: { input },
    });

    return result.tenantMemberAdd;
  }

  async update(input: TenantMemberUpdateInput): Promise<MutationResponse> {
    const query = `
      mutation TenantMemberUpdate($input: TenantMemberUpdateRequestDto!) {
        tenantMemberUpdate(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{
      tenantMemberUpdate: MutationResponse;
    }>({
      query,
      variables: { input },
    });

    return result.tenantMemberUpdate;
  }

  async remove(input: TenantMemberRemoveInput): Promise<MutationResponse> {
    const query = `
      mutation TenantMemberRemove($input: TenantMemberRemoveRequestDto!) {
        tenantMemberRemove(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{
      tenantMemberRemove: MutationResponse;
    }>({
      query,
      variables: { input },
    });

    return result.tenantMemberRemove;
  }
}
