import { AssertSagaStepViewModelExistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-view-model-exists/assert-saga-step-view-model-exists.service';
import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepDeletedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-deleted/saga-step-deleted.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaStepDeletedEvent)
export class SagaStepDeletedEventHandler
  implements IEventHandler<SagaStepDeletedEvent>
{
  private readonly logger = new Logger(SagaStepDeletedEventHandler.name);

  constructor(
    @Inject(SAGA_STEP_READ_REPOSITORY_TOKEN)
    private readonly sagaStepReadRepository: SagaStepReadRepository,
    private readonly assertSagaStepViewModelExistsService: AssertSagaStepViewModelExistsService,
  ) {}

  /**
   * Handles the SagaStepDeletedEvent event by removing the existing saga step view model.
   *
   * @param event - The SagaStepDeletedEvent event to handle.
   */
  async handle(event: SagaStepDeletedEvent) {
    this.logger.log(`Handling saga step deleted event: ${event.aggregateId}`);

    // 01: Assert the saga step view model exists
    const existingSagaStepViewModel =
      await this.assertSagaStepViewModelExistsService.execute(
        event.aggregateId,
      );

    // 02: Delete the saga step view model
    await this.sagaStepReadRepository.delete(existingSagaStepViewModel.id);
  }
}
