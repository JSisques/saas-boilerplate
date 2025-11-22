import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type SubscriptionPrimitives = BasePrimitives & {
  id: string;
  tenantId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  trialEndDate: Date | null;
  status: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  renewalMethod: string;
};
