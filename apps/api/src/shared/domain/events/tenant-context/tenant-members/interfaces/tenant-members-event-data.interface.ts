import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface ITenantMemberEventData extends IBaseEventData {
  id: string;
  tenantId: string;
  userId: string;
  role: string;
}
