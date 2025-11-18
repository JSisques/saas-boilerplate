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
  createdAt: Date;
  updatedAt: Date;
};
