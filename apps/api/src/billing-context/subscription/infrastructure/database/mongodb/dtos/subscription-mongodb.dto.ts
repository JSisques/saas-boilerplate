export type SubscriptionMongoDbDto = {
  id: string;
  tenantId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  trialEndDate: Date | null;
  status: string;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  renewalMethod: string;
  createdAt: Date;
  updatedAt: Date;
};
