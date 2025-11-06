import { RenewalMethodEnum, SubscriptionStatusEnum } from '@prisma/client';

export type SubscriptionPrismaDto = {
  id: string;
  tenantId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  trialEndDate: Date | null;
  status: SubscriptionStatusEnum;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  renewalMethod: RenewalMethodEnum;
};
