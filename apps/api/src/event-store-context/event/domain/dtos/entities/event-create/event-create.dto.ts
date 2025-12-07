import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/event/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/event/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { IBaseAggregateDto } from '@/shared/domain/interfaces/base-aggregate-dto.interface';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';

/**
 * Data Transfer Object for creating a new event entity.
 *
 * @interface IEventCreateDto
 * @property {EventUuidValueObject} id - The unique id entifier for the event.
 * @property {EventTypeValueObject} eventType - The event type of the event.
 * @property {EventAggregateTypeValueObject} aggregateType - The aggregate type of the event.
 * @property {EventAggregateIdValueObject} aggregateId - The aggregate id of the event.
 * @property {EventPayloadValueObject} payload - The payload of the event.
 * @property {EventTimestampValueObject} timestamp - The timestamp of the event.
 */
export interface IEventCreateDto extends IBaseAggregateDto {
  id: EventUuidValueObject;
  eventType: EventTypeValueObject;
  aggregateType: EventAggregateTypeValueObject;
  aggregateId: EventAggregateIdValueObject;
  payload: EventPayloadValueObject;
  timestamp: EventTimestampValueObject;
}
