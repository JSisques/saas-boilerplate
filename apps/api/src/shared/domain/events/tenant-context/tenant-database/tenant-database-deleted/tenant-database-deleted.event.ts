import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ITenantDatabaseEventData } from '@/shared/domain/events/tenant-context/tenant-database/interfaces/tenant-database-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Tenant database deleted event
 *
 * @class TenantDatabaseDeletedEvent
 * @extends {BaseEvent<ITenantDatabaseEventData>}
 * @param metadata - The metadata of the event
 * @param data - The data of the event
 */
export class TenantDatabaseDeletedEvent extends BaseEvent<ITenantDatabaseEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: ITenantDatabaseEventData) {
    super(metadata, data);
  }
}
