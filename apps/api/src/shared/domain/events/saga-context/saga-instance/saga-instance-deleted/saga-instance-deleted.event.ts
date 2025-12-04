import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ISagaInstanceEventData } from '@/shared/domain/events/saga-context/saga-instance/interfaces/saga-instance-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Saga instance deleted event
 *
 * @class SagaInstanceDeletedEvent
 * @extends {BaseEvent<ISagaInstanceEventData>}
 * @param metadata - The metadata of the event
 * @param data - The data of the event
 */
export class SagaInstanceDeletedEvent extends BaseEvent<ISagaInstanceEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: ISagaInstanceEventData) {
    super(metadata, data);
  }
}
