import { useSDKContext } from '../../react/sdk-context.js';

import {
  MutationResponse,
  PaginatedSubscriptionPlanResult,
  SubscriptionPlanDeleteInput,
  SubscriptionPlanFindByCriteriaInput,
  SubscriptionPlanFindByIdInput,
  SubscriptionPlanResponse,
  SubscriptionPlanUpdateInput,
} from '../../index.js';
import { useAsyncState } from '../../react/hooks/index.js';
import { SubscriptionPlanCreateInput } from '../types/subscription-plan-create-input.type.js';

/**
 * Hook for creating a subscription plan
 */
export function useSubscriptionPlans() {
  const sdk = useSDKContext();

  const findByCriteria = useAsyncState<
    PaginatedSubscriptionPlanResult,
    [SubscriptionPlanFindByCriteriaInput]
  >((input: SubscriptionPlanFindByCriteriaInput) =>
    sdk.subscriptionPlans.findByCriteria(input),
  );

  const findById = useAsyncState<
    SubscriptionPlanResponse,
    [SubscriptionPlanFindByIdInput]
  >((input: SubscriptionPlanFindByIdInput) =>
    sdk.subscriptionPlans.findById(input),
  );

  const create = useAsyncState<MutationResponse, [SubscriptionPlanCreateInput]>(
    (input: SubscriptionPlanCreateInput) => sdk.subscriptionPlans.create(input),
  );

  const update = useAsyncState<MutationResponse, [SubscriptionPlanUpdateInput]>(
    (input: SubscriptionPlanUpdateInput) => sdk.subscriptionPlans.update(input),
  );

  const remove = useAsyncState<MutationResponse, [SubscriptionPlanDeleteInput]>(
    (input: SubscriptionPlanDeleteInput) => sdk.subscriptionPlans.delete(input),
  );

  return {
    findByCriteria: {
      ...findByCriteria,
      fetch: findByCriteria.execute,
    },
    findById: {
      ...findById,
      fetch: findById.execute,
    },
    create: {
      ...create,
      fetch: create.execute,
    },
    update: {
      ...update,
      fetch: update.execute,
    },
    remove: {
      ...remove,
      fetch: remove.execute,
    },
  };
}
