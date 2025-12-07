import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type EventPrimitives = BasePrimitives & {
  id: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, unknown>;
  timestamp: Date;
};
