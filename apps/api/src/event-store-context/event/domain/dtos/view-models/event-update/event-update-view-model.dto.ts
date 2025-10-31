import { IEventCreateViewModelDto } from '@/event-store-context/event/domain/dtos/view-models/event-create/event-create-view-model.dto';

/**
 * Data Transfer Object for updating a event view model.
 *
 * @interface IEventUpdateViewModelDto
 * @property {string | null} eventType - The event type of the event (nullable).
 * @property {string | null} aggregateType - The aggregate type of the event (nullable).
 * @property {string | null} aggregateId - The aggregate id of the event (nullable).
 * @property {string | null} payload - The payload of the event (nullable).
 * @property {Date} timestamp - The timestamp of the event (nullable).
 * @property {Date} createdAt - Timestamp when the event was created.
 * @property {Date} updatedAt - Timestamp when the event was last updated.
 */
export interface IEventUpdateViewModelDto
  extends Partial<
    Omit<IEventCreateViewModelDto, 'id' | 'createdAt' | 'updatedAt'>
  > {}
