/**
 * Data Transfer Object for replaying an event via command layer.
 *
 * @interface IEventReplayCommandDto
 * @property {string} id - The id of the event to replay.
 * @property {string} eventType - The type of the event to replay.
 * @property {Date} from - The start date of the event to replay.
 * @property {Date} to - The end date of the event to replay.
 */
export interface IEventReplayCommandDto {
  id?: string;
  eventType: string;
  aggregateId?: string;
  aggregateType?: string;
  from: Date;
  to: Date;
  batchSize?: number;
}
