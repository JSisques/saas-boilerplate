/**
 * Data Transfer Object for deleting a subscription plan by id via command layer.
 *
 * @interface ISubscriptionPlanDeleteCommandDto
 * @property {string} id - The id of the subscription plan to delete.
 */
export interface ISubscriptionPlanDeleteCommandDto {
  id: string;
}
