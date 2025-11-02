export interface ISubscriptionPlanEventData {
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
  features: Record<string, any> | null;
  limits: Record<string, any> | null;
  stripePriceId: string | null;
}
