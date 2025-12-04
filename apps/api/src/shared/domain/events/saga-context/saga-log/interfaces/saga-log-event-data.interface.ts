import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface ISagaLogEventData extends IBaseEventData {
  id: string;
  sagaInstanceId: string;
  sagaStepId: string;
  type: string;
  message: string;
}
