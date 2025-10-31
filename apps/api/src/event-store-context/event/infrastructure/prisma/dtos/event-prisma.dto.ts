export type EventPrismaDto = {
  id: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: any | null;
  timestamp: Date;
};
