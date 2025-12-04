import type { SagaStepStatus } from './saga-step-status.type.js';

export type SagaStepResponse = {
  id: string;
  sagaInstanceId: string;
  name: string;
  order: number;
  status: SagaStepStatus;
  startDate: Date | null;
  endDate: Date | null;
  errorMessage: string | null;
  retryCount: number;
  maxRetries: number;
  payload: any;
  result: any;
  createdAt: Date;
  updatedAt: Date;
};
