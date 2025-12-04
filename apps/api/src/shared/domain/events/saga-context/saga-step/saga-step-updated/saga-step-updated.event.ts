import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ISagaStepEventData } from '@/shared/domain/events/saga-context/saga-step/interfaces/saga-step-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Saga step updated event
 *
 * @class SagaStepUpdatedEvent
 * @extends {BaseEvent<Partial<Omit<ISagaStepEventData, 'id' | 'sagaInstanceId'>>>}
 * @param metadata - The metadata of the event
 * @param data - The data of the event
 */
export class SagaStepUpdatedEvent extends BaseEvent<
  Partial<Omit<ISagaStepEventData, 'id' | 'sagaInstanceId'>>
> {
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<ISagaStepEventData, 'id' | 'sagaInstanceId'>>,
  ) {
    super(metadata, data);
  }
}
