import { IAuthEventData } from '@/shared/domain/events/auth/interfaces/auth-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Auth registered by email event
 *
 * This event extends BaseEvent with IAuthEventData, which includes IEventDataWithTenantContext.
 * This means the event can optionally include tenantId and tenantName for saga orchestration.
 *
 * @class AuthRegisteredByEmailEvent
 * @extends {BaseEvent<IAuthEventData>}
 * @param metadata - The metadata of the event
 * @param data - The data of the event (includes optional tenantId and tenantName via IEventDataWithTenantContext)
 */
export class AuthRegisteredByEmailEvent extends BaseEvent<IAuthEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: IAuthEventData) {
    super(metadata, data);
  }
}
