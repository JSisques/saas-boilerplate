import { AssertSagaLogViewModelExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-view-model-exists/assert-saga-log-view-model-exists.service';
import {
  SAGA_LOG_READ_REPOSITORY_TOKEN,
  SagaLogReadRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogDeletedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-deleted/saga-log-deleted.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaLogDeletedEvent)
export class SagaLogDeletedEventHandler
  implements IEventHandler<SagaLogDeletedEvent>
{
  private readonly logger = new Logger(SagaLogDeletedEventHandler.name);

  constructor(
    @Inject(SAGA_LOG_READ_REPOSITORY_TOKEN)
    private readonly sagaLogReadRepository: SagaLogReadRepository,
    private readonly assertSagaLogViewModelExistsService: AssertSagaLogViewModelExistsService,
  ) {}

  /**
   * Handles the SagaLogDeletedEvent event by removing the existing saga log view model.
   *
   * @param event - The SagaLogDeletedEvent event to handle.
   */
  async handle(event: SagaLogDeletedEvent) {
    this.logger.log(`Handling saga log deleted event: ${event.aggregateId}`);

    // 01: Assert the saga log view model exists
    const existingSagaLogViewModel =
      await this.assertSagaLogViewModelExistsService.execute(event.aggregateId);

    // 02: Delete the saga log view model
    await this.sagaLogReadRepository.delete(existingSagaLogViewModel.id);
  }
}
