import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface ISubscriptionEventData extends IBaseEventData {
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
}
