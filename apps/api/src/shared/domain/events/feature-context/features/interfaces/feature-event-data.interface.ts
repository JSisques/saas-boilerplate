import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface IFeatureEventData extends IBaseEventData {
  id: string;
  key: string;
  name: string;
  description: string | null;
  status: string;
}
