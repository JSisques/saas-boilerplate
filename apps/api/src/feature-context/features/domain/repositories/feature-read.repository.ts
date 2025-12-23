import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { IBaseReadRepository } from '@/shared/domain/interfaces/base-read-repository.interface';

export const FEATURE_READ_REPOSITORY_TOKEN = Symbol('FeatureReadRepository');

/**
 * Type alias for the feature read repository.
 * This repository handles read operations (queries) for features.
 *
 * @type IFeatureReadRepository
 */
export type IFeatureReadRepository = IBaseReadRepository<FeatureViewModel>;
