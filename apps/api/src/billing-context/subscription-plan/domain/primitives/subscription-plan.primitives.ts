import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type SubscriptionPlanPrimitives = BasePrimitives & {
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
  features: any | null;
  limits: any | null;
  stripePriceId: string | null;
};
