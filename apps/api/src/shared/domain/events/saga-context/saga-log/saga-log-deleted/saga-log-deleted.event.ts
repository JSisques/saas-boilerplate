import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ISagaLogEventData } from '@/shared/domain/events/saga-context/saga-log/interfaces/saga-log-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Saga log deleted event
 *
 * @class SagaLogDeletedEvent
 * @extends {BaseEvent<ISagaLogEventData>}
 * @param metadata - The metadata of the event
 * @param data - The data of the event
 */
export class SagaLogDeletedEvent extends BaseEvent<ISagaLogEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: ISagaLogEventData) {
    super(metadata, data);
  }
}
