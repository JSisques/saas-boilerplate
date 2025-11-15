import { Currency } from '../types/subscription-plan-currency.type.js';
import { SubscriptionPlanInterval } from '../types/subscription-plan-interval.type.js';
import { SubscriptionPlanType } from '../types/subscription-plan-type.type.js';

export type SubscriptionPlanCreateInput = {
  name: string;
  type: SubscriptionPlanType;
  description?: string;
  priceMonthly: number;
  currency: Currency;
  interval: SubscriptionPlanInterval;
  intervalCount: number;
  trialPeriodDays?: number;
  features?: string[];
  limits?: string[];
  stripePriceId?: string;
};
