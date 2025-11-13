import { Criteria } from '@/shared/domain/entities/criteria';

/**
 * Data Transfer Object for finding subscription by criteria.
 *
 * @interface ISubscriptionFindByCriteriaQueryDto
 * @property {Criteria} criteria - The criteria to find the subscription by.
 */
export interface ISubscriptionFindByCriteriaQueryDto {
  criteria: Criteria;
}
