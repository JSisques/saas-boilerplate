import { ISubscriptionPlanCreateDto } from '@/billing-context/subscription-plan/domain/dtos/entities/subscription-plan-create/subscription-plan-create.dto';

/**
 * Data Transfer Object for updating a subscription plan.
 *
 * Allows partial updating of a subscription plan entity, excluding the subscription plan's immutable identifier (`id`).
 * @interface ISubscriptionPlanUpdateDto
 * @extends Partial<Omit<ISubscriptionPlanCreateDto, 'id'>>
 */
export interface ISubscriptionPlanUpdateDto
  extends Partial<Omit<ISubscriptionPlanCreateDto, 'id'>> {}
