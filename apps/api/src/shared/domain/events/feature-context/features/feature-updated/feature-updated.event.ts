import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IFeatureEventData } from '@/shared/domain/events/feature-context/features/interfaces/feature-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class FeatureUpdatedEvent extends BaseEvent<
  Partial<Omit<IFeatureEventData, 'id'>>
> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<IFeatureEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
