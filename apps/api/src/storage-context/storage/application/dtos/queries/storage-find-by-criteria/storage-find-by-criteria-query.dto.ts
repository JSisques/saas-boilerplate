import { Criteria } from '@/shared/domain/entities/criteria';

/**
 * Data Transfer Object for finding storage by criteria.
 *
 * @interface IStorageFindByCriteriaQueryDto
 * @property {Criteria} criteria - The criteria to find the storage by.
 */
export interface IStorageFindByCriteriaQueryDto {
  criteria: Criteria;
}
