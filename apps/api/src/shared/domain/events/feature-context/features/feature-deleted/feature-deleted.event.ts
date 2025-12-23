import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IFeatureEventData } from '@/shared/domain/events/feature-context/features/interfaces/feature-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Feature deleted event
 *
 * @class FeatureDeletedEvent
 * @extends {BaseEvent<IFeatureEventData>}
 * @param metadata - The metadata of the event
 * @param data - The data of the event
 */
export class FeatureDeletedEvent extends BaseEvent<IFeatureEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: IFeatureEventData) {
    super(metadata, data);
  }
}
