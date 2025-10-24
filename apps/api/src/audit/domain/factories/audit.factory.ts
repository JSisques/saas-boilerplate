import { AuditAggregate } from '@/audit/domain/aggregates/audit.aggregate';
import { IAuditCreateDto } from '@/audit/domain/dtos/entities/audit-create/audit-create.dto';
import { AuditPrimitives } from '@/audit/domain/primitives/audit.primitives';
import { AuditAggregateIdValueObject } from '@/audit/domain/value-objects/audit-aggregate-id.vo';
import { AuditAggregateTypeValueObject } from '@/audit/domain/value-objects/audit-aggregate-type.vo';
import { AuditEventTypeValueObject } from '@/audit/domain/value-objects/audit-event-type.vo';
import { AuditPayloadValueObject } from '@/audit/domain/value-objects/audit-payload.vo';
import { AuditTimestampValueObject } from '@/audit/domain/value-objects/audit-timestamp.vo';
import { AuditUuidValueObject } from '@/audit/domain/value-objects/audit-uuid.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { Injectable } from '@nestjs/common';

export const AUDIT_FACTORY_TOKEN = Symbol('AuditFactory');

/**
 * This factory class is used to create a new audit entity.
 */
@Injectable()
export class AuditFactory
  implements IWriteFactory<AuditAggregate, IAuditCreateDto, AuditPrimitives>
{
  /**
   * Creates a new audit entity with the given properties.
   *
   * @param data - The data to create the audit entity.
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
