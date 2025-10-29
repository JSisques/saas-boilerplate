export type AuditMongoDbDto = {
  id: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: any;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
};
