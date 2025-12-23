import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { IBaseWriteRepository } from '@/shared/domain/interfaces/base-write-repository.interface';

export const FEATURE_WRITE_REPOSITORY_TOKEN = Symbol('FeatureWriteRepository');

/**
 * Type alias for the feature write repository.
 * This repository handles write operations (create, update, delete) for features.
 *
 * @type IFeatureWriteRepository
 */
export type IFeatureWriteRepository = IBaseWriteRepository<FeatureAggregate>;
