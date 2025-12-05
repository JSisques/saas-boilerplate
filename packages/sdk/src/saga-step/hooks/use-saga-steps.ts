'use client';
import { useAsyncState } from '../../react/hooks/use-async-state.js';
import { useSDKContext } from '../../react/index.js';
import type { MutationResponse } from '../../shared/types/index.js';
import type {
  PaginatedSagaStepResult,
  SagaStepChangeStatusInput,
  SagaStepCreateInput,
  SagaStepDeleteInput,
  SagaStepFindByCriteriaInput,
  SagaStepFindByIdInput,
  SagaStepFindBySagaInstanceIdInput,
  SagaStepResponse,
  SagaStepUpdateInput,
} from '../index.js';

/**
 * Hook for saga step operations
 */
export function useSagaSteps() {
  const sdk = useSDKContext();
  const findByCriteria = useAsyncState<
    PaginatedSagaStepResult,
    [SagaStepFindByCriteriaInput?]
  >((input?: SagaStepFindByCriteriaInput) =>
    sdk.sagaSteps.findByCriteria(input),
  );

  const findById = useAsyncState<SagaStepResponse, [SagaStepFindByIdInput]>(
    (input: SagaStepFindByIdInput) => sdk.sagaSteps.findById(input),
  );

  const findBySagaInstanceId = useAsyncState<
    SagaStepResponse[],
    [SagaStepFindBySagaInstanceIdInput]
  >((input: SagaStepFindBySagaInstanceIdInput) =>
    sdk.sagaSteps.findBySagaInstanceId(input),
  );

  const create = useAsyncState<MutationResponse, [SagaStepCreateInput]>(
    (input: SagaStepCreateInput) => sdk.sagaSteps.create(input),
  );

  const update = useAsyncState<MutationResponse, [SagaStepUpdateInput]>(
    (input: SagaStepUpdateInput) => sdk.sagaSteps.update(input),
  );

  const changeStatus = useAsyncState<
    MutationResponse,
    [SagaStepChangeStatusInput]
  >((input: SagaStepChangeStatusInput) => sdk.sagaSteps.changeStatus(input));

  const remove = useAsyncState<MutationResponse, [SagaStepDeleteInput]>(
    (input: SagaStepDeleteInput) => sdk.sagaSteps.delete(input),
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
    findBySagaInstanceId: {
      ...findBySagaInstanceId,
      fetch: findBySagaInstanceId.execute,
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
