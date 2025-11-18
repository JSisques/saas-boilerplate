export type EventReplayInput = {
  id?: string;
  eventType?: string;
  aggregateId?: string;
  aggregateType?: string;
  from: Date;
  to: Date;
  batchSize?: number;
};
