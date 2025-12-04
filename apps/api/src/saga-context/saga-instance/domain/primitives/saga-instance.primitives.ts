import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type SagaInstancePrimitives = BasePrimitives & {
  id: string;
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};
