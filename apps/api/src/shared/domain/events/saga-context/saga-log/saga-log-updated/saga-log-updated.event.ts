import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ISagaLogEventData } from '@/shared/domain/events/saga-context/saga-log/interfaces/saga-log-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class SagaLogUpdatedEvent extends BaseEvent<
  Partial<Omit<ISagaLogEventData, 'id' | 'sagaInstanceId' | 'sagaStepId'>>
> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(
    metadata: IEventMetadata,
    data: Partial<
      Omit<ISagaLogEventData, 'id' | 'sagaInstanceId' | 'sagaStepId'>
    >,
  ) {
    super(metadata, data);
  }
}
