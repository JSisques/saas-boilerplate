import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ISagaStepEventData } from '@/shared/domain/events/saga-context/saga-step/interfaces/saga-step-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Saga step deleted event
 *
 * @class SagaStepDeletedEvent
 * @extends {BaseEvent<ISagaStepEventData>}
 * @param metadata - The metadata of the event
 * @param data - The data of the event
 */
export class SagaStepDeletedEvent extends BaseEvent<ISagaStepEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: ISagaStepEventData) {
    super(metadata, data);
  }
}
