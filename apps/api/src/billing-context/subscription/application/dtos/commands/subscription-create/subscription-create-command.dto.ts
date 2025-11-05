/**
 * Data Transfer Object for creating a new subscription plan via command layer.
 *
 * @interface ISubscriptionCreateCommandDto
 * @property {string} tenantId - The id of the tenant. Must be provided.
 * @property {string} planId - The id of the subscription plan. Must be provided.
 * @property {Date} startDate - The start date of the subscription. Must be provided.
 * @property {Date} endDate - The end date of the subscription. Must be provided.
 * @property {string | null} stripeSubscriptionId - The stripe subscription id of the subscription. Can be null if not provided.
 * @property {string | null} stripeCustomerId - The stripe customer id of the subscription. Can be null if not provided.
 * @property {string} renewalMethod - The renewal method of the subscription. Must be provided.
 */

export interface ISubscriptionCreateCommandDto {
  tenantId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  renewalMethod: string;
}
