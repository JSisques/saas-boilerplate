import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type SagaStepPrimitives = BasePrimitives & {
  id: string;
  sagaInstanceId: string;
  name: string;
  order: number;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  errorMessage: string | null;
  retryCount: number;
  maxRetries: number;
  payload: any;
  result: any;
};
