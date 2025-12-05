import type { SagaLogType } from './saga-log-type.type.js';

export type SagaLogResponse = {
  id: string;
  sagaInstanceId: string;
  sagaStepId: string;
  type: SagaLogType;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};
