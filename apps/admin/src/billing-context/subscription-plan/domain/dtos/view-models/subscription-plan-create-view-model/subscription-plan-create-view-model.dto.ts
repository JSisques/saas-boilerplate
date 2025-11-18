/**
 * Data Transfer Object for creating a subscription plan.
 *
 * @interface ISubscriptionPlanCreateViewModelDto
 * @property {string} id - The immutable identifier of the subscription plan.
 * @property {string} name - The name of the subscription plan.
 * @property {string} slug - The slug of the subscription plan.
 * @property {string} type - The type of the subscription plan.
 * @property {string | null} description - The description of the subscription plan.
 * @property {number} priceMonthly - The price of the subscription plan.
 * @property {number} priceYearly - The price of the subscription plan.
 * @property {string} currency - The currency of the subscription plan.
 * @property {string} interval - The interval of the subscription plan.
 * @property {number} intervalCount - The interval count of the subscription plan.
 * @property {number | null} trialPeriodDays - The trial period days of the subscription plan.
 * @property {boolean} isActive - The is active of the subscription plan.
 * @property {Record<string, unknown> | null} features - The features of the subscription plan.
 * @property {Record<string, unknown> | null} limits - The limits of the subscription plan.
 * @property {string | null} stripePriceId - The stripe price id of the subscription plan.
 */
export interface ISubscriptionPlanCreateViewModelDto {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  interval: string;
  intervalCount: number;
  trialPeriodDays: number | null;
  isActive: boolean;
  features: Record<string, unknown> | null;
  limits: Record<string, unknown> | null;
  stripePriceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
