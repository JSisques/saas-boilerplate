import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ITenantDatabaseEventData } from '@/shared/domain/events/tenant-context/tenant-database/interfaces/tenant-database-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class TenantDatabaseUpdatedEvent extends BaseEvent<
  Partial<Omit<ITenantDatabaseEventData, 'id'>>
> {
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<ITenantDatabaseEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
