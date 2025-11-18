import { ISubscriptionPlanCreateDto } from '@/billing-context/subscription-plan/domain/dtos/entities/subscription-plan-create/subscription-plan-create.dto';

/**
 * Data Transfer Object for updating a subscription plan.
 *
 * Allows partial updating of a subscription plan entity, excluding the subscription plan's immutable identifier (`id`).
 * @type ISubscriptionPlanUpdateDto
 * @extends Partial<Omit<ISubscriptionPlanCreateDto, 'id'>>
 */
export type ISubscriptionPlanUpdateDto = Partial<
  Omit<ISubscriptionPlanCreateDto, 'id'>
>;
