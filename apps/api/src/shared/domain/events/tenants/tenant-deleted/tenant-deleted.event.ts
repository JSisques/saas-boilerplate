import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ITenantEventData } from '@/shared/domain/events/tenants/interfaces/tenant-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * User deleted event
 *
 * @class TenantDeletedEvent
 * @extends {BaseEvent<ITenantEventData>}
 * @param metadata - The metadata of the event
 * @param data - The data of the event
 */
export class TenantDeletedEvent extends BaseEvent<ITenantEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: ITenantEventData) {
    super(metadata, data);
  }
}
