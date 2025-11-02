import { ISubscriptionPlanCreateViewModelDto } from '@/billing-context/subscription-plan/domain/dtos/view-models/subscription-plan-create-view-model/subscription-plan-create-view-model.dto';

/**
 * Data Transfer Object for updating a subscription plan.
 *
 * Allows partial updating of a subscription plan entity, excluding the subscription plan's immutable identifier (`id`).
 * @interface ISubscriptionPlanUpdateViewModelDto
 * @extends Partial<Omit<ISubscriptionPlanCreateViewModelDto, 'id'>>
 */
export interface ISubscriptionPlanUpdateViewModelDto
  extends Partial<Omit<ISubscriptionPlanCreateViewModelDto, 'id'>> {}
