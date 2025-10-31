import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventEventData } from '@/shared/domain/events/event-store/interfaces/event-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class EventCreatedEvent extends BaseEvent<IEventEventData> {
  constructor(metadata: IEventMetadata, data: IEventEventData) {
    super(metadata, data);
  }
}
