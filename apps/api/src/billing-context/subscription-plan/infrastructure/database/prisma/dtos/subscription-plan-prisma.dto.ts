import {
  CurrencyEnum,
  SubscriptionPlanIntervalEnum,
  SubscriptionPlanTypeEnum,
} from '@/prisma/master/client';
import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';

export type SubscriptionPlanPrismaDto = BasePrismaDto & {
  id: string;
  name: string;
  slug: string;
  type: SubscriptionPlanTypeEnum;
  description: string | null;
  priceMonthly: number;
  priceYearly: number;
  currency: CurrencyEnum;
  interval: SubscriptionPlanIntervalEnum;
  intervalCount: number;
  trialPeriodDays: number | null;
  isActive: boolean;
  features: Record<string, any> | null;
  limits: Record<string, any> | null;
  stripePriceId: string | null;
};
