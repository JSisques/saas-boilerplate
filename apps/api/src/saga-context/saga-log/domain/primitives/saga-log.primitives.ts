import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type SagaLogPrimitives = BasePrimitives & {
  id: string;
  sagaInstanceId: string;
  sagaStepId: string;
  type: string;
  message: string;
};
