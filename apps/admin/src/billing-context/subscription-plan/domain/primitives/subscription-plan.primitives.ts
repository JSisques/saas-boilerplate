export type SubscriptionPlanPrimitives = {
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
};
