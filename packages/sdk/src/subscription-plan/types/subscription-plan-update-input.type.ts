import { Currency } from './subscription-plan-currency.type.js';
import { SubscriptionPlanInterval } from './subscription-plan-interval.type.js';
import { SubscriptionPlanType } from './subscription-plan-type.type.js';

export type SubscriptionPlanUpdateInput = {
  id: string;
  name?: string;
  type?: SubscriptionPlanType;
  description?: string;
  priceMonthly?: number;
  currency?: Currency;
  interval?: SubscriptionPlanInterval;
  intervalCount?: number;
  trialPeriodDays?: number;
  features?: string[];
  limits?: string[];
  stripePriceId?: string;
};
