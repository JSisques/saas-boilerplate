/**
 * Data Transfer Object for canceling a subscription by id via command layer.
 *
 * @interface ISubscriptionCancelCommandDto
 * @property {string} id - The id of the subscription to cancel.
 */
export interface ISubscriptionCancelCommandDto {
  id: string;
}
