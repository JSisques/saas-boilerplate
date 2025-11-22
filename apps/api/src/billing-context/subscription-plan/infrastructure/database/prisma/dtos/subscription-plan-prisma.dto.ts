import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';
import {
  CurrencyEnum,
  SubscriptionPlanIntervalEnum,
  SubscriptionPlanTypeEnum,
} from '@prisma/client';

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
