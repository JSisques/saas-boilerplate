'use client';
import { useAsyncState } from '../../react/hooks/use-async-state.js';
import { useSDKContext } from '../../react/index.js';
import type { MutationResponse } from '../../shared/types/index.js';
import type {
  PaginatedSagaInstanceResult,
  SagaInstanceChangeStatusInput,
  SagaInstanceCreateInput,
  SagaInstanceDeleteInput,
  SagaInstanceFindByCriteriaInput,
  SagaInstanceFindByIdInput,
  SagaInstanceResponse,
  SagaInstanceUpdateInput,
} from '../index.js';

/**
 * Hook for saga instance operations
 */
export function useSagaInstances() {
  const sdk = useSDKContext();
  const findByCriteria = useAsyncState<
    PaginatedSagaInstanceResult,
    [SagaInstanceFindByCriteriaInput?]
  >((input?: SagaInstanceFindByCriteriaInput) =>
    sdk.sagaInstances.findByCriteria(input),
  );

  const findById = useAsyncState<
    SagaInstanceResponse,
    [SagaInstanceFindByIdInput]
  >((input: SagaInstanceFindByIdInput) => sdk.sagaInstances.findById(input));

  const create = useAsyncState<MutationResponse, [SagaInstanceCreateInput]>(
    (input: SagaInstanceCreateInput) => sdk.sagaInstances.create(input),
  );

  const update = useAsyncState<MutationResponse, [SagaInstanceUpdateInput]>(
    (input: SagaInstanceUpdateInput) => sdk.sagaInstances.update(input),
  );

  const changeStatus = useAsyncState<
    MutationResponse,
    [SagaInstanceChangeStatusInput]
  >((input: SagaInstanceChangeStatusInput) =>
    sdk.sagaInstances.changeStatus(input),
  );

  const remove = useAsyncState<MutationResponse, [SagaInstanceDeleteInput]>(
    (input: SagaInstanceDeleteInput) => sdk.sagaInstances.delete(input),
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
      mutate: create.execute,
    },
    update: {
      ...update,
      mutate: update.execute,
    },
    changeStatus: {
      ...changeStatus,
      mutate: changeStatus.execute,
    },
    delete: {
      ...remove,
      mutate: remove.execute,
    },
  };
}
