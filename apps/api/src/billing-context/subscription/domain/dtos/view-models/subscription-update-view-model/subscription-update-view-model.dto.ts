import { ISubscriptionCreateViewModelDto } from '@/billing-context/subscription/domain/dtos/view-models/subscription-create-view-model/subscription-create-view-model.dto';

/**
 * Data Transfer Object for updating a subscription.
 *
 * Allows partial updating of a subscription entity, excluding the subscription's immutable identifier (`id`).
 * @type ISubscriptionUpdateViewModelDto
 * @extends Partial<Omit<ISubscriptionCreateViewModelDto, 'id'>>
 */
export type ISubscriptionUpdateViewModelDto = Partial<
  Omit<
    ISubscriptionCreateViewModelDto,
    'id' | 'tenantId' | 'createdAt' | 'updatedAt'
  >
>;
