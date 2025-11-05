/**
 * Data Transfer Object for deleting a subscription by id via command layer.
 *
 * @interface ISubscriptionDeleteCommandDto
 * @property {string} id - The id of the subscription to delete.
 */
export interface ISubscriptionDeleteCommandDto {
  id: string;
}
