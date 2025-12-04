import type { SagaLogType } from './saga-log-type.type.js';

export type SagaLogCreateInput = {
  sagaInstanceId: string;
  sagaStepId: string;
  type: SagaLogType;
  message: string;
};
