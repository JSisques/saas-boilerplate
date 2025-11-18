import { ISubscriptionPlanCreateViewModelDto } from '@/billing-context/subscription-plan/domain/dtos/view-models/subscription-plan-create-view-model/subscription-plan-create-view-model.dto';

/**
 * Data Transfer Object for updating a subscription plan.
 *
 * Allows partial updating of a subscription plan entity, excluding the subscription plan's immutable identifier (`id`).
 * @type ISubscriptionPlanUpdateViewModelDto
 * @extends Partial<Omit<ISubscriptionPlanCreateViewModelDto, 'id'>>
 */
export type ISubscriptionPlanUpdateViewModelDto = Partial<
  Omit<ISubscriptionPlanCreateViewModelDto, 'id'>
>;
