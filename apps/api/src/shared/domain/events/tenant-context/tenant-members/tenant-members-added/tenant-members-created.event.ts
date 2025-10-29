import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ITenantMemberEventData } from '@/shared/domain/events/tenant-context/tenant-members/interfaces/tenant-members-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class TenantMemberAddedEvent extends BaseEvent<ITenantMemberEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: ITenantMemberEventData) {
    super(metadata, data);
  }
}
