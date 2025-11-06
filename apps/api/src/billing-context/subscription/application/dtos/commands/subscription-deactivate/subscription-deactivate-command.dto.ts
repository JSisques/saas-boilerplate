/**
 * Data Transfer Object for deactivating a subscription by id via command layer.
 *
 * @interface ISubscriptionDeactivateCommandDto
 * @property {string} id - The id of the subscription to deactivate.
 */
export interface ISubscriptionDeactivateCommandDto {
  id: string;
}
