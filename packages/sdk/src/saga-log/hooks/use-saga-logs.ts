'use client';
import { useAsyncState } from '../../react/hooks/use-async-state.js';
import { useSDKContext } from '../../react/index.js';
import type { MutationResponse } from '../../shared/types/index.js';
import type {
  PaginatedSagaLogResult,
  SagaLogCreateInput,
  SagaLogDeleteInput,
  SagaLogFindByCriteriaInput,
  SagaLogFindByIdInput,
  SagaLogFindBySagaInstanceIdInput,
  SagaLogFindBySagaStepIdInput,
  SagaLogResponse,
  SagaLogUpdateInput,
} from '../index.js';

/**
 * Hook for saga log operations
 */
export function useSagaLogs() {
  const sdk = useSDKContext();
  const findByCriteria = useAsyncState<
    PaginatedSagaLogResult,
    [SagaLogFindByCriteriaInput?]
  >((input?: SagaLogFindByCriteriaInput) => sdk.sagaLogs.findByCriteria(input));

  const findById = useAsyncState<SagaLogResponse, [SagaLogFindByIdInput]>(
    (input: SagaLogFindByIdInput) => sdk.sagaLogs.findById(input),
  );

  const findBySagaInstanceId = useAsyncState<
    SagaLogResponse[],
    [SagaLogFindBySagaInstanceIdInput]
  >((input: SagaLogFindBySagaInstanceIdInput) =>
    sdk.sagaLogs.findBySagaInstanceId(input),
  );

  const findBySagaStepId = useAsyncState<
    SagaLogResponse[],
    [SagaLogFindBySagaStepIdInput]
  >((input: SagaLogFindBySagaStepIdInput) =>
    sdk.sagaLogs.findBySagaStepId(input),
  );

  const create = useAsyncState<MutationResponse, [SagaLogCreateInput]>(
    (input: SagaLogCreateInput) => sdk.sagaLogs.create(input),
  );

  const update = useAsyncState<MutationResponse, [SagaLogUpdateInput]>(
    (input: SagaLogUpdateInput) => sdk.sagaLogs.update(input),
  );

  const remove = useAsyncState<MutationResponse, [SagaLogDeleteInput]>(
    (input: SagaLogDeleteInput) => sdk.sagaLogs.delete(input),
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
    findBySagaStepId: {
      ...findBySagaStepId,
      fetch: findBySagaStepId.execute,
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
