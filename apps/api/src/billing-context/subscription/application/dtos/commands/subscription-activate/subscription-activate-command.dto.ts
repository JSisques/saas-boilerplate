/**
 * Data Transfer Object for activating a subscription by id via command layer.
 *
 * @interface ISubscriptionActivateCommandDto
 * @property {string} id - The id of the subscription to activate.
 */
export interface ISubscriptionActivateCommandDto {
  id: string;
}
