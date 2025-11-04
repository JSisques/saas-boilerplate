import type {
  PaginatedSubscriptionPlanResult,
  SubscriptionPlanCreateInput,
  SubscriptionPlanDeleteInput,
  SubscriptionPlanFindByCriteriaInput,
  SubscriptionPlanUpdateInput,
} from '../../billing-context/types/index.js';
import type { SDK } from '../../index.js';
import type { MutationResponse } from '../../shared/types/index.js';
import { useAsyncState } from './use-async-state.js';

/**
 * Hook for subscription plan operations
 */
export function useSubscriptionPlans(sdk: SDK) {
  const findByCriteria = useAsyncState<PaginatedSubscriptionPlanResult>(
    (input?: SubscriptionPlanFindByCriteriaInput) =>
      sdk.subscriptionPlans.findByCriteria(input),
  );

  const create = useAsyncState<MutationResponse>(
    (input: SubscriptionPlanCreateInput) => sdk.subscriptionPlans.create(input),
  );

  const update = useAsyncState<MutationResponse>(
    (input: SubscriptionPlanUpdateInput) => sdk.subscriptionPlans.update(input),
  );

  const remove = useAsyncState<MutationResponse>(
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
