import type { SagaStepStatus } from './saga-step-status.type.js';

export type SagaStepChangeStatusInput = {
  id: string;
  status: SagaStepStatus;
};
