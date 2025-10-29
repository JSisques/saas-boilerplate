import { AuditAggregateFactory } from '@/audit-context/audit/domain/factories/audit-aggregate.factory';
import {
  AUDIT_WRITE_REPOSITORY_TOKEN,
  AuditWriteRepository,
} from '@/audit-context/audit/domain/repositories/audit-write.repository';
import { IBaseService } from '@/shared/application/services/base-service.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { UuidValueObject } from '@/shared/domain/value-objects/uuid.vo';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class AuditTrackingService
  implements IBaseService<BaseEvent<any>, void>
{
  private readonly logger = new Logger(AuditTrackingService.name);

  constructor(
    @Inject(AUDIT_WRITE_REPOSITORY_TOKEN)
    private readonly auditWriteRepository: AuditWriteRepository,
    private readonly auditAggregateFactory: AuditAggregateFactory,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Tracks an event by creating an audit entity, saving it to the repository,
   * publishing any uncommitted audit events, and marking them as committed.
   *
   * @param {BaseEvent<any>} event - The domain event to be tracked and audited.
   * @returns {Promise<void>} Resolves when the audit process is complete.
   *
   * The flow of this method is:
   * 1. Create an audit entity from the received event.
   * 2. Save the audit entity to the corresponding repository.
   * 3. Publish all uncommitted audit events.
   * 4. Mark the audit events as committed.
   */
  async execute(event: BaseEvent<any>): Promise<void> {
    this.logger.log(`Tracking audit event: ${event.eventType}`);

    // 01: Create the audit entity
    const newAudit = this.auditAggregateFactory.fromPrimitives({
      id: UuidValueObject.generate().value,
      eventType: event.eventType,
      aggregateType: event.aggregateType,
      aggregateId: event.aggregateId,
      payload: event.data,
      timestamp: event.ocurredAt,
    });

    // 02: Save the audit entity
    await this.auditWriteRepository.save(newAudit);

    // 03: Publish the audit events
    await this.eventBus.publishAll(newAudit.getUncommittedEvents());

    // 04: Mark the audit events as committed
    newAudit.commit();
  }
}
