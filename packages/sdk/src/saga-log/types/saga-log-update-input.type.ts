import type { SagaLogType } from './saga-log-type.type.js';

export type SagaLogUpdateInput = {
  id: string;
  type?: SagaLogType;
  message?: string;
};
