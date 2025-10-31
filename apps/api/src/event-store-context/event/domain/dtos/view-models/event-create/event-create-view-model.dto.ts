/**
 * Event creation view model Data Transfer Object.
 *
 * Represents the structure of data returned when a event is created, tailored for presentation layers.
 *
 * @interface IEventCreateViewModelDto
 * @property {string} id - The unique, immutable identifier of the event.
 * @property {string} eventType - The event type of the event.
 * @property {string} aggregateType - The aggregate type of the event.
 * @property {string} aggregateId - The aggregate id of the event.
 * @property {string} payload - The payload of the event.
 * @property {Date} timestamp - The timestamp of the event.
 * @property {Date} createdAt - Timestamp when the event was created.
 * @property {Date} updatedAt - Timestamp when the event was last updated.
 */
export interface IEventCreateViewModelDto {
  id: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, any>;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}
