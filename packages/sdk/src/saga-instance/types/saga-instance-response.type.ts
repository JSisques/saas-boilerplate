import type { SagaInstanceStatus } from './saga-instance-status.type.js';

export type SagaInstanceResponse = {
  id: string;
  name: string;
  status: SagaInstanceStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
