/**
 * Data Transfer Object for creating a subscription.
 *
 * @interface ISubscriptionCreateViewModelDto
 * @property {string} id - The immutable identifier of the subscription.
 * @property {string} tenantId - The immutable identifier of the tenant.
 * @property {string} planId - The immutable identifier of the subscription plan.
 * @property {Date} startDate - The start date of the subscription.
 * @property {Date} endDate - The end date of the subscription.
 * @property {Date | null} trialEndDate - The trial end date of the subscription.
 * @property {string} status - The status of the subscription.
 * @property {string | null} stripeSubscriptionId - The stripe subscription id of the subscription.
 * @property {string | null} stripeCustomerId - The stripe customer id of the subscription.
 * @property {string} renewalMethod - The renewal method of the subscription.
 */
export interface ISubscriptionCreateViewModelDto {
  id: string;
  tenantId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  trialEndDate: Date | null;
  status: string;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  renewalMethod: string;
  createdAt: Date;
  updatedAt: Date;
}
