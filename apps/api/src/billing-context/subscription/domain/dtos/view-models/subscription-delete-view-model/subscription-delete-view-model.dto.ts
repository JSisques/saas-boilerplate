import { ISubscriptionCreateViewModelDto } from '@/billing-context/subscription/domain/dtos/view-models/subscription-create-view-model/subscription-create-view-model.dto';

/**
 * Data Transfer Object for deleting a subscription.
 *
 * Allows deleting a subscription entity by specifying only the subscription's immutable identifier (`id`).
 * @type ISubscriptionDeleteViewModelDto
 * @property {string} id - The immutable identifier of the subscription to delete.
 */
export type ISubscriptionDeleteViewModelDto = Pick<
  ISubscriptionCreateViewModelDto,
  'id'
>;
