import type {
  PaginatedSubscriptionPlanResult,
  SubscriptionPlanCreateInput,
  SubscriptionPlanDeleteInput,
  SubscriptionPlanFindByCriteriaInput,
  SubscriptionPlanUpdateInput,
} from '@/billing-context/types/index';
import { GraphQLClient } from '@/shared/client/graphql-client';
import type { MutationResponse } from '@/shared/types/index';

export class SubscriptionPlanClient {
  constructor(private client: GraphQLClient) {}

  async findByCriteria(
    input?: SubscriptionPlanFindByCriteriaInput,
  ): Promise<PaginatedSubscriptionPlanResult> {
    const query = `
      query SubscriptionPlanFindByCriteria($input: SubscriptionPlanFindByCriteriaRequestDto) {
        subscriptionPlanFindByCriteria(input: $input) {
          total
          page
          perPage
          totalPages
          items {
            id
            name
            slug
            type
            description
            priceMonthly
            priceYearly
            currency
            interval
            intervalCount
            trialPeriodDays
            isActive
            features
            limits
            stripePriceId
          }
        }
      }
    `;

    const result = await this.client.request<{
      subscriptionPlanFindByCriteria: PaginatedSubscriptionPlanResult;
    }>({
      query,
      variables: { input: input || {} },
    });

    return result.subscriptionPlanFindByCriteria;
  }

  async create(input: SubscriptionPlanCreateInput): Promise<MutationResponse> {
    const query = `
      mutation SubscriptionPlanCreate($input: SubscriptionPlanCreateRequestDto!) {
        subscriptionPlanCreate(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{
      subscriptionPlanCreate: MutationResponse;
    }>({
      query,
      variables: { input },
    });

    return result.subscriptionPlanCreate;
  }

  async update(input: SubscriptionPlanUpdateInput): Promise<MutationResponse> {
    const query = `
      mutation SubscriptionPlanUpdate($input: SubscriptionPlanUpdateRequestDto!) {
        subscriptionPlanUpdate(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{
      subscriptionPlanUpdate: MutationResponse;
    }>({
      query,
      variables: { input },
    });

    return result.subscriptionPlanUpdate;
  }

  async delete(input: SubscriptionPlanDeleteInput): Promise<MutationResponse> {
    const query = `
      mutation SubscriptionPlanDelete($input: SubscriptionPlanDeleteRequestDto!) {
        subscriptionPlanDelete(input: $input) {
          success
          message
          id
        }
      }
    `;

    const result = await this.client.request<{
      subscriptionPlanDelete: MutationResponse;
    }>({
      query,
      variables: { input },
    });

    return result.subscriptionPlanDelete;
  }
}
