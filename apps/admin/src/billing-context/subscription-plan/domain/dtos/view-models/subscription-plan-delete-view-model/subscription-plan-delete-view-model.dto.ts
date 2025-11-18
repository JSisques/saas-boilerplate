import { ISubscriptionPlanCreateViewModelDto } from '@/billing-context/subscription-plan/domain/dtos/view-models/subscription-plan-create-view-model/subscription-plan-create-view-model.dto';

/**
 * Data Transfer Object for deleting a subscription plan.
 *
 * Allows deleting a subscription plan entity by specifying only the subscription plan's immutable identifier (`id`).
 * @type ISubscriptionPlanDeleteViewModelDto
 * @property {string} id - The immutable identifier of the subscription plan to delete.
 */
export type ISubscriptionPlanDeleteViewModelDto = Pick<
  ISubscriptionPlanCreateViewModelDto,
  'id'
>;
