import { SagaLogViewModelFactory } from '@/saga-context/saga-log/domain/factories/saga-log-view-model/saga-log-view-model.factory';
import {
  SAGA_LOG_READ_REPOSITORY_TOKEN,
  SagaLogReadRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogCreatedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-created/saga-log-created.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaLogCreatedEvent)
export class SagaLogCreatedEventHandler
  implements IEventHandler<SagaLogCreatedEvent>
{
  private readonly logger = new Logger(SagaLogCreatedEventHandler.name);

  constructor(
    @Inject(SAGA_LOG_READ_REPOSITORY_TOKEN)
    private readonly sagaLogReadRepository: SagaLogReadRepository,
    private readonly sagaLogViewModelFactory: SagaLogViewModelFactory,
  ) {}

  /**
   * Handles the SagaLogCreatedEvent event by creating a new saga log view model.
   *
   * @param event - The SagaLogCreatedEvent event to handle.
   */
  async handle(event: SagaLogCreatedEvent) {
    this.logger.log(`Handling saga log created event: ${event.aggregateId}`);

    // 01: Create the saga log view model
    const sagaLogCreatedViewModel: SagaLogViewModel =
      this.sagaLogViewModelFactory.fromPrimitives(event.data);

    // 02: Save the saga log view model
    await this.sagaLogReadRepository.save(sagaLogCreatedViewModel);
  }
}
