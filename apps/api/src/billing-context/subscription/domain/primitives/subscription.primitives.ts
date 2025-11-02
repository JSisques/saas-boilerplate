export type SubscriptionPrimitives = {
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
