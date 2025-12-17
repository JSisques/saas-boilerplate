import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { IBaseWriteRepository } from '@/shared/domain/interfaces/base-write-repository.interface';

/**
 * Interface for the feature write repository.
 * This repository handles write operations (create, update, delete) for features.
 *
 * @interface IFeatureWriteRepository
 * @extends IBaseWriteRepository<FeatureAggregate>
 */
export interface IFeatureWriteRepository
  extends IBaseWriteRepository<FeatureAggregate> {}
