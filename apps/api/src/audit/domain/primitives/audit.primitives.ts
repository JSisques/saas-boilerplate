export type AuditPrimitives = {
  id: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, any>;
  timestamp: Date;
};
