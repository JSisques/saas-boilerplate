import { IAuditEventData } from '@/shared/domain/events/audit/interfaces/audit-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class AuditCreatedEvent extends BaseEvent<IAuditEventData> {
  constructor(metadata: IEventMetadata, data: IAuditEventData) {
    super(metadata, data);
  }
}
