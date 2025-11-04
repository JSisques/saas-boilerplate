import type {
  FindByCriteriaInput,
  PaginatedResult,
} from '@/shared/types/index';

export type SubscriptionPlanType = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
export type Currency = 'USD' | 'EUR';
export type SubscriptionPlanInterval = 'MONTHLY' | 'YEARLY';

export type SubscriptionPlanResponse = {
  id: string;
  name: string;
  slug: string;
  type?: string;
  description?: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  interval: string;
  intervalCount: number;
  trialPeriodDays: number;
  isActive: boolean;
  features?: string[];
  limits?: string[];
  stripePriceId?: string;
};

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

export type SubscriptionPlanDeleteInput = {
  id: string;
};

export type SubscriptionPlanFindByCriteriaInput = FindByCriteriaInput;
export type PaginatedSubscriptionPlanResult =
  PaginatedResult<SubscriptionPlanResponse>;
