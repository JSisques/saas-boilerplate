import { AuditAggregateIdValueObject } from '@/audit/domain/value-objects/audit-aggregate-id/audit-aggregate-id.vo';
import { AuditAggregateTypeValueObject } from '@/audit/domain/value-objects/audit-aggregate-type/audit-aggregate-type.vo';
import { AuditEventTypeValueObject } from '@/audit/domain/value-objects/audit-event-type/audit-event-type.vo';
import { AuditPayloadValueObject } from '@/audit/domain/value-objects/audit-payload/audit-payload.vo';
import { AuditTimestampValueObject } from '@/audit/domain/value-objects/audit-timestamp/audit-timestamp.vo';
import { AuditUuidValueObject } from '@/shared/domain/value-objects/identifiers/audit-uuid/audit-uuid.vo';

/**
 * Data Transfer Object for creating a new audit entity.
 *
 * @interface IAuditCreateDto
 * @property {AuditUuidValueObject} id - The unique identifier for the audit.
 * @property {AuditEventTypeValueObject} eventType - The event type of the audit.
 * @property {AuditAggregateTypeValueObject} aggregateType - The aggregate type of the audit.
 * @property {AuditAggregateIdValueObject} aggregateId - The aggregate id of the audit.
 * @property {AuditPayloadValueObject} payload - The payload of the audit.
 * @property {AuditTimestampValueObject} timestamp - The timestamp of the audit.
 */
export interface IAuditCreateDto {
  id: AuditUuidValueObject;
  eventType: AuditEventTypeValueObject;
  aggregateType: AuditAggregateTypeValueObject;
  aggregateId: AuditAggregateIdValueObject;
  payload: AuditPayloadValueObject;
  timestamp: AuditTimestampValueObject;
}
