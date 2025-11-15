import {
  SUBSCRIPTION_PLAN_CREATE_MUTATION,
  SUBSCRIPTION_PLAN_DELETE_MUTATION,
  SUBSCRIPTION_PLAN_UPDATE_MUTATION,
} from '../graphql/mutations/subscription-plan.mutations.js';
import {
  SUBSCRIPTION_PLAN_FIND_BY_CRITERIA_QUERY,
  SUBSCRIPTION_PLAN_FIND_BY_ID_QUERY,
} from '../graphql/queries/subscription-plan.queries.js';
import { SubscriptionPlanCreateInput } from '../types/subscription-plan-create-input.type.js';
import { SubscriptionPlanDeleteInput } from '../types/subscription-plan-delete-input.type.js';
import { SubscriptionPlanFindByCriteriaInput } from '../types/subscription-plan-find-by-criteria-input.type.js';
import { SubscriptionPlanFindByIdInput } from '../types/subscription-plan-find-by-id-input.type.js';
import { PaginatedSubscriptionPlanResult } from '../types/subscription-plan-paginated-response.type.js';
import { SubscriptionPlanResponse } from '../types/subscription-plan-response.type.js';
import { SubscriptionPlanUpdateInput } from '../types/subscription-plan-update-input.type.js';

import { GraphQLClient } from '../../../shared/client/graphql-client.js';
import type { MutationResponse } from '../../../shared/types/index.js';

export class SubscriptionPlanClient {
  constructor(private client: GraphQLClient) {}

  /**
   * Finds subscription plans by criteria with pagination, filters, and sorting
   *
   * @param input - The input object containing the criteria to find subscription plans
   * @returns The paginated subscription plan result
   */
  async findByCriteria(
    input?: SubscriptionPlanFindByCriteriaInput,
  ): Promise<PaginatedSubscriptionPlanResult> {
    const result = await this.client.request<{
      subscriptionPlanFindByCriteria: PaginatedSubscriptionPlanResult;
    }>({
      query: SUBSCRIPTION_PLAN_FIND_BY_CRITERIA_QUERY,
      variables: { input: input || {} },
    });

    return result.subscriptionPlanFindByCriteria;
  }

  /**
   * Finds a subscription plan by its ID
   *
   * @param input - The input object containing the ID of the subscription plan to find
   * @returns The subscription plan response
   */
  async findById(
    input: SubscriptionPlanFindByIdInput,
  ): Promise<SubscriptionPlanResponse> {
    const result = await this.client.request<{
      subscriptionPlanFindById: SubscriptionPlanResponse;
    }>({
      query: SUBSCRIPTION_PLAN_FIND_BY_ID_QUERY,
      variables: { input },
    });

    return result.subscriptionPlanFindById;
  }

  /**
   * Creates a new subscription plan
   *
   * @param input - The input object containing the data to create a new subscription plan
   * @returns The mutation response
   */
  async create(input: SubscriptionPlanCreateInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      subscriptionPlanCreate: MutationResponse;
    }>({
      query: SUBSCRIPTION_PLAN_CREATE_MUTATION,
      variables: { input },
    });

    return result.subscriptionPlanCreate;
  }

  /**
   * Updates an existing subscription plan
   *
   * @param input - The input object containing the data to update the subscription plan
   * @returns The mutation response
   */
  async update(input: SubscriptionPlanUpdateInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      subscriptionPlanUpdate: MutationResponse;
    }>({
      query: SUBSCRIPTION_PLAN_UPDATE_MUTATION,
      variables: { input },
    });

    return result.subscriptionPlanUpdate;
  }

  /**
   * Deletes a subscription plan
   *
   * @param input - The input object containing the data to delete the subscription plan
   * @returns The mutation response
   */
  async delete(input: SubscriptionPlanDeleteInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      subscriptionPlanDelete: MutationResponse;
    }>({
      query: SUBSCRIPTION_PLAN_DELETE_MUTATION,
      variables: { input },
    });

    return result.subscriptionPlanDelete;
  }
}
