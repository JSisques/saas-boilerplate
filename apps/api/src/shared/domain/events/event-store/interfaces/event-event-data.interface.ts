import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface IEventEventData extends IBaseEventData {
  id: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, any>;
  timestamp: Date;
}
