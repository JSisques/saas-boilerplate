import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ITenantEventData } from '@/shared/domain/events/tenant-context/tenants/interfaces/tenant-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class TenantUpdatedEvent extends BaseEvent<
  Partial<Omit<ITenantEventData, 'id'>>
> {
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<ITenantEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
