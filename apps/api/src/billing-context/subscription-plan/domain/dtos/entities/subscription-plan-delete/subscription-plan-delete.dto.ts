import { ISubscriptionPlanCreateDto } from '@/billing-context/subscription-plan/domain/dtos/entities/subscription-plan-create/subscription-plan-create.dto';

/**
 * Data Transfer Object for deleting a subscription plan.
 *
 * Allows deleting a subscription plan entity by specifying only the subscription plan's immutable identifier (`id`).
 * @type ISubscriptionPlanDeleteDto
 * @property {SubscriptionPlanUuidValueObject} id - The immutable identifier of the subscription plan to delete.
 */
export type ISubscriptionPlanDeleteDto = Pick<ISubscriptionPlanCreateDto, 'id'>;
