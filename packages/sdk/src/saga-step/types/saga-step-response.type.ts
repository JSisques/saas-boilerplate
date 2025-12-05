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
  payload: Record<string, unknown>;
  result: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};
