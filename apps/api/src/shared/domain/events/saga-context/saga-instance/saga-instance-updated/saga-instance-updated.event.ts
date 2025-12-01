import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ISagaInstanceEventData } from '@/shared/domain/events/saga-context/saga-instance/interfaces/saga-instance-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Saga instance updated event
 *
 * @class SagaInstanceUpdatedEvent
 * @extends {BaseEvent<Partial<Omit<ISagaInstanceEventData, 'id'>>>}
 * @param metadata - The metadata of the event
 * @param data - The data of the event
 */
export class SagaInstanceUpdatedEvent extends BaseEvent<
  Partial<Omit<ISagaInstanceEventData, 'id'>>
> {
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<ISagaInstanceEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
