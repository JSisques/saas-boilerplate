import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ITenantMemberEventData } from '@/shared/domain/events/tenant-context/tenant-members/interfaces/tenant-members-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class TenantMemberUpdatedEvent extends BaseEvent<
  Partial<Omit<ITenantMemberEventData, 'id'>>
> {
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<ITenantMemberEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
