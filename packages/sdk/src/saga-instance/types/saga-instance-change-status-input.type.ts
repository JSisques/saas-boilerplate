import type { SagaInstanceStatus } from './saga-instance-status.type.js';

export type SagaInstanceChangeStatusInput = {
  id: string;
  status: SagaInstanceStatus;
};
