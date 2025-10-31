export interface IEventMetadata {
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  isReplay?: boolean;
}
