import { GraphQLClient } from '@/shared/client/graphql-client';
import type { MutationResponse } from '@/shared/types/index';
import type {
  PaginatedTenantResult,
  TenantCreateInput,
  TenantDeleteInput,
  TenantFindByCriteriaInput,
  TenantUpdateInput,
} from '@/tenant-context/types/index';

export class TenantClient {
  constructor(private client: GraphQLClient) {}

  async findByCriteria(
    input?: TenantFindByCriteriaInput,
  ): Promise<PaginatedTenantResult> {
    const query = `
      query TenantFindByCriteria($input: TenantFindByCriteriaRequestDto) {
        tenantFindByCriteria(input: $input) {
          total
          page
          perPage
          totalPages
          items {
            id
            name
            slug
            description
            websiteUrl
            logoUrl
            faviconUrl
            primaryColor
            secondaryColor
            status
            email
            phoneNumber
            phoneCode
            address
            city
            state
            country
            postalCode
            timezone
            locale
            maxUsers
            maxStorage
            maxApiCalls
            createdAt
            updatedAt
          }
        }
      }
    `;

    const result = await this.client.request<{
      tenantFindByCriteria: PaginatedTenantResult;
    }>({
      query,
      variables: { input: input || {} },
    });

    return result.tenantFindByCriteria;
  }

  async create(input: TenantCreateInput): Promise<MutationResponse> {
    const query = `
      mutation TenantCreate($input: TenantCreateRequestDto!) {
        tenantCreate(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{
      tenantCreate: MutationResponse;
    }>({
      query,
      variables: { input },
    });

    return result.tenantCreate;
  }

  async update(input: TenantUpdateInput): Promise<MutationResponse> {
    const query = `
      mutation TenantUpdate($input: TenantUpdateRequestDto!) {
        tenantUpdate(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{
      tenantUpdate: MutationResponse;
    }>({
      query,
      variables: { input },
    });

    return result.tenantUpdate;
  }

  async delete(input: TenantDeleteInput): Promise<MutationResponse> {
    const query = `
      mutation TenantDelete($input: TenantDeleteRequestDto!) {
        tenantDelete(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{
      tenantDelete: MutationResponse;
    }>({
      query,
      variables: { input },
    });

    return result.tenantDelete;
  }
}
