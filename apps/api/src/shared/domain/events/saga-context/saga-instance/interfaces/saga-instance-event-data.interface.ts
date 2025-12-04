import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface ISagaInstanceEventData extends IBaseEventData {
  id: string;
  name: string;
  status: string;
  startDate: Date;
  endDate: Date;
}
