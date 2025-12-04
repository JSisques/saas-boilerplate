import { AssertSagaLogViewModelExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-view-model-exists/assert-saga-log-view-model-exists.service';
import {
  SAGA_LOG_READ_REPOSITORY_TOKEN,
  SagaLogReadRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogUpdatedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-updated/saga-log-updated.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaLogUpdatedEvent)
export class SagaLogUpdatedEventHandler
  implements IEventHandler<SagaLogUpdatedEvent>
{
  private readonly logger = new Logger(SagaLogUpdatedEventHandler.name);

  constructor(
    @Inject(SAGA_LOG_READ_REPOSITORY_TOKEN)
    private readonly sagaLogReadRepository: SagaLogReadRepository,
    private readonly assertSagaLogViewModelExistsService: AssertSagaLogViewModelExistsService,
  ) {}

  /**
   * Handles the SagaLogUpdatedEvent event by updating the existing saga log view model.
   *
   * @param event - The SagaLogUpdatedEvent event to handle.
   */
  async handle(event: SagaLogUpdatedEvent) {
    this.logger.log(`Handling saga log updated event: ${event.aggregateId}`);

    // 01: Assert the saga log view model exists
    const existingSagaLogViewModel =
      await this.assertSagaLogViewModelExistsService.execute(event.aggregateId);

    // 02: Update the existing view model with new data
    existingSagaLogViewModel.update(event.data);

    // 03: Save the updated saga log view model
    await this.sagaLogReadRepository.save(existingSagaLogViewModel);
  }
}
