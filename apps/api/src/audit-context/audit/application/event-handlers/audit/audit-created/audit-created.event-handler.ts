import { AuditViewModelFactory } from '@/audit-context/audit/domain/factories/audit-view-model.factory';
import {
  AUDIT_READ_REPOSITORY_TOKEN,
  AuditReadRepository,
} from '@/audit-context/audit/domain/repositories/audit-read.repository';
import { AuditCreatedEvent } from '@/shared/domain/events/audit/audit-created/audit-created.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(AuditCreatedEvent)
export class AuditCreatedEventHandler
  implements IEventHandler<AuditCreatedEvent>
{
  private readonly logger = new Logger(AuditCreatedEventHandler.name);

  constructor(
    @Inject(AUDIT_READ_REPOSITORY_TOKEN)
    private readonly auditReadRepository: AuditReadRepository,
    private readonly auditViewModelFactory: AuditViewModelFactory,
  ) {}

  /**
   * Handles the AuditCreatedEvent by transforming the event data into a view model
   * and persisting it in the read database. This method ensures that the read database
   * is synchronized and updated with the changes produced in the domain, allowing efficient
   * and consistent queries for read operations.
   *
   * @param event - The AuditCreatedEvent containing the audit data to be reflected in the read model.
   */
  async handle(event: AuditCreatedEvent) {
    this.logger.log(`Handling audit created event: ${event.aggregateId}`);

    // 01: Create the audit view model
    const newAuditViewModel = this.auditViewModelFactory.fromPrimitives(
      event.data,
    );

    // 02: Save the audit view model
    await this.auditReadRepository.save(newAuditViewModel);
  }
}
