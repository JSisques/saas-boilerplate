/**
 * Data Transfer Object for creating a new subscription plan via command layer.
 *
 * @interface ISubscriptionPlanCreateCommandDto
 * @property {string} name - The name of the subscription plan. Must be provided.
 * @property {string} type - The type of the subscription plan. Must be provided.
 * @property {string | null} description - The description of the subscription plan. Can be null if not provided.
 * @property {number} priceMonthly - The price of the subscription plan per month. Must be provided.
 * @property {number} priceYearly - The price of the subscription plan per year. Must be provided.
 * @property {string} currency - The currency of the subscription plan. Must be provided.
 * @property {string} interval - The interval of the subscription plan. Must be provided.
 * @property {number} intervalCount - The interval count of the subscription plan. Must be provided.
 * @property {number | null} trialPeriodDays - The trial period days of the subscription plan. Can be null if not provided.
 * @property {boolean} isActive - The active status of the subscription plan. Must be provided.
 * @property {any | null} features - The features of the subscription plan. Can be null if not provided.
 * @property {any | null} limits - The limits of the subscription plan. Can be null if not provided.
 * @property {string | null} stripePriceId - The stripe price id of the subscription plan. Can be null if not provided.
 */

export interface ISubscriptionPlanCreateCommandDto {
  name: string;
  type: string;
  description: string | null;
  priceMonthly: number;
  currency: string;
  interval: string;
  intervalCount: number;
  trialPeriodDays: number | null;
  features: any | null;
  limits: any | null;
  stripePriceId: string | null;
}
