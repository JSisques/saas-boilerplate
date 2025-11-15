import { MutationResponse, SDK } from '../../../index.js';
import { useAsyncState } from '../../../react/hooks/index.js';
import { SubscriptionPlanCreateInput } from '../types/subscription-plan-create-input.type.js';
import { SubscriptionPlanDeleteInput } from '../types/subscription-plan-delete-input.type.js';
import { SubscriptionPlanFindByCriteriaInput } from '../types/subscription-plan-find-by-criteria-input.type.js';
import { PaginatedSubscriptionPlanResult } from '../types/subscription-plan-paginated-response.type.js';
import { SubscriptionPlanUpdateInput } from '../types/subscription-plan-update-input.type.js';

/**
 * Hook for subscription plan operations
 */
export function useSubscriptionPlans(sdk: SDK) {
  const findByCriteria = useAsyncState<
    PaginatedSubscriptionPlanResult,
    [SubscriptionPlanFindByCriteriaInput?]
  >((input?: SubscriptionPlanFindByCriteriaInput) =>
    sdk.subscriptionPlans.findByCriteria(input),
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
    create: {
      ...create,
      mutate: create.execute,
    },
    update: {
      ...update,
      mutate: update.execute,
    },
    delete: {
      ...remove,
      mutate: remove.execute,
    },
  };
}
