'use client';
import { useAsyncState } from '../../react/hooks/use-async-state.js';
import { useSDKContext } from '../../react/index.js';
import type { MutationResponse } from '../../shared/types/index.js';
import type {
  CreateFeatureInput,
  DeleteFeatureInput,
  FeatureChangeStatusInput,
  FeatureFindByCriteriaInput,
  FeatureFindByIdInput,
  PaginatedFeatureResult,
  UpdateFeatureInput,
  FeatureResponse,
} from '../index.js';

/**
 * Hook for feature operations
 */
export function useFeatures() {
  const sdk = useSDKContext();
  const findByCriteria = useAsyncState<
    PaginatedFeatureResult,
    [FeatureFindByCriteriaInput?]
  >((input?: FeatureFindByCriteriaInput) => sdk.features.findByCriteria(input));

  const findById = useAsyncState<FeatureResponse, [FeatureFindByIdInput]>(
    (input: FeatureFindByIdInput) => sdk.features.findById(input),
  );

  const create = useAsyncState<MutationResponse, [CreateFeatureInput]>(
    (input: CreateFeatureInput) => sdk.features.create(input),
  );

  const update = useAsyncState<MutationResponse, [UpdateFeatureInput]>(
    (input: UpdateFeatureInput) => sdk.features.update(input),
  );

  const deleteFeature = useAsyncState<MutationResponse, [DeleteFeatureInput]>(
    (input: DeleteFeatureInput) => sdk.features.delete(input),
  );

  const changeStatus = useAsyncState<
    MutationResponse,
    [FeatureChangeStatusInput]
  >((input: FeatureChangeStatusInput) => sdk.features.changeStatus(input));

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
    delete: {
      ...deleteFeature,
      mutate: deleteFeature.execute,
    },
    changeStatus: {
      ...changeStatus,
      mutate: changeStatus.execute,
    },
  };
}
