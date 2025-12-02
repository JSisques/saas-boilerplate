import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface ISagaStepEventData extends IBaseEventData {
  id: string;
  sagaInstanceId: string;
  name: string;
  order: number;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  errorMessage: string | null;
  retryCount: number;
  maxRetries: number;
  payload: any;
  result: any;
}
