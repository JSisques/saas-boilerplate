import type { SagaInstanceStatus } from './saga-instance-status.type.js';

export type SagaInstanceUpdateInput = {
  id: string;
  name?: string;
  status?: SagaInstanceStatus;
  startDate?: Date | null;
  endDate?: Date | null;
};
