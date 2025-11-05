import { ISubscriptionCreateDto } from '@/billing-context/subscription/domain/dtos/entities/subscription-create/subscription-create.dto';

/**
 * Data Transfer Object for deleting a subscription.
 *
 * Allows deleting a subscription entity by specifying only the subscription's immutable identifier (`id`).
 * @type ISubscriptionDeleteDto
 * @property {SubscriptionUuidValueObject} id - The immutable identifier of the subscription to delete.
 */
export type ISubscriptionDeleteDto = Pick<ISubscriptionCreateDto, 'id'>;
