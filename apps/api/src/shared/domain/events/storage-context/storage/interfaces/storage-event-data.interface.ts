import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface IStorageEventData extends IBaseEventData {
  id: string;
  path: string;
  provider: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}
