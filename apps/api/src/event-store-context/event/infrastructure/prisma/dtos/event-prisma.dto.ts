import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';

export type EventPrismaDto = BaseMongoDto & {
  id: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, unknown> | null;
  timestamp: Date;
};
