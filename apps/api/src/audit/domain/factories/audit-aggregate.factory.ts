import { AuditAggregate } from '@/audit/domain/aggregates/audit.aggregate';
import { IAuditCreateDto } from '@/audit/domain/dtos/entities/audit-create/audit-create.dto';
import { AuditPrimitives } from '@/audit/domain/primitives/audit.primitives';
import { AuditAggregateIdValueObject } from '@/audit/domain/value-objects/audit-aggregate-id/audit-aggregate-id.vo';
import { AuditAggregateTypeValueObject } from '@/audit/domain/value-objects/audit-aggregate-type/audit-aggregate-type.vo';
import { AuditEventTypeValueObject } from '@/audit/domain/value-objects/audit-event-type/audit-event-type.vo';
import { AuditPayloadValueObject } from '@/audit/domain/value-objects/audit-payload/audit-payload.vo';
import { AuditTimestampValueObject } from '@/audit/domain/value-objects/audit-timestamp/audit-timestamp.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { AuditUuidValueObject } from '@/shared/domain/value-objects/identifiers/audit-uuid/audit-uuid.vo';
import { Injectable } from '@nestjs/common';

export const AUDIT_AGGREGATE_FACTORY_TOKEN = Symbol('AuditAggregateFactory');

/**
 * This factory class is used to create a new audit aggregate.
 */
@Injectable()
export class AuditAggregateFactory
  implements IWriteFactory<AuditAggregate, IAuditCreateDto, AuditPrimitives>
{
  /**
   * Creates a new audit aggregate with the given properties.
   *
   * @param data - The data to create the audit aggregate.
   * @param data.id - The id of the audit.
   * @param data.eventType - The event type of the audit.
   * @param data.aggregateType - The aggregate type of the audit.
   * @param data.aggregateId - The aggregate id of the audit.
   * @param data.payload - The payload of the audit.
   * @param data.timestamp - The timestamp of the audit.
   *
   * @returns The audit entity.
   */
  public create(data: IAuditCreateDto): AuditAggregate {
    return new AuditAggregate(data);
  }

  /**
   * Creates a new audit entity from primitive data.
   *
   * @param primitives - The primitive data to create the audit entity from.
   * @param primitives.id - The id of the audit.
   * @param primitives.eventType - The event type of the audit.
   * @param primitives.aggregateType - The aggregate type of the audit.
   * @param primitives.aggregateId - The aggregate id of the audit.
   * @param primitives.payload - The payload of the audit.
   * @param primitives.timestamp - The timestamp of the audit.
   *
   * @returns
   */
  public fromPrimitives(primitives: AuditPrimitives): AuditAggregate {
    return new AuditAggregate({
      id: new AuditUuidValueObject(primitives.id),
      eventType: new AuditEventTypeValueObject(primitives.eventType),
      aggregateType: new AuditAggregateTypeValueObject(
        primitives.aggregateType,
      ),
      aggregateId: new AuditAggregateIdValueObject(primitives.aggregateId),
      payload: new AuditPayloadValueObject(primitives.payload),
      timestamp: new AuditTimestampValueObject(primitives.timestamp),
    });
  }
}
