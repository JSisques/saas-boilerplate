import type { SagaStepStatus } from './saga-step-status.type.js';

export type SagaStepUpdateInput = {
  id: string;
  name?: string;
  order?: number;
  status?: SagaStepStatus;
  startDate?: Date | null;
  endDate?: Date | null;
  errorMessage?: string | null;
  retryCount?: number;
  maxRetries?: number;
  payload?: string; // JSON string
  result?: string; // JSON string
};
