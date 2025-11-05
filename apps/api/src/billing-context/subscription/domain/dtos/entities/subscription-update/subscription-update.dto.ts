import { ISubscriptionCreateDto } from '@/billing-context/subscription/domain/dtos/entities/subscription-create/subscription-create.dto';

/**
 * Data Transfer Object for updating a subscription.
 *
 * Allows partial updating of a subscription entity, excluding the subscription's immutable identifier (`id`).
 * @type ISubscriptionUpdateDto
 * @extends Partial<Omit<ISubscriptionCreateDto, 'id'>>
 */
export type ISubscriptionUpdateDto = Partial<
  Omit<ISubscriptionCreateDto, 'id' | 'tenantId'>
>;
