import { AssertSagaStepViewModelExistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-view-model-exists/assert-saga-step-view-model-exists.service';
import { SagaStepViewModelFactory } from '@/saga-context/saga-step/domain/factories/saga-step-view-model/saga-step-view-model.factory';
import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-status-changed/saga-step-status-changed.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaStepStatusChangedEvent)
export class SagaStepStatusChangedEventHandler
  implements IEventHandler<SagaStepStatusChangedEvent>
{
  private readonly logger = new Logger(SagaStepStatusChangedEventHandler.name);

  constructor(
    @Inject(SAGA_STEP_READ_REPOSITORY_TOKEN)
    private readonly sagaStepReadRepository: SagaStepReadRepository,
    private readonly sagaStepViewModelFactory: SagaStepViewModelFactory,
    private readonly assertSagaStepViewModelExistsService: AssertSagaStepViewModelExistsService,
  ) {}

  /**
   * Handles the SagaStepStatusChangedEvent event by updating the saga step view model status.
   *
   * @param event - The SagaStepStatusChangedEvent event to handle.
   */
  async handle(event: SagaStepStatusChangedEvent) {
    this.logger.log(
      `Handling saga step status changed event: ${event.aggregateId}`,
    );

    // 01: Assert the saga step view model exists
    const existingSagaStepViewModel =
      await this.assertSagaStepViewModelExistsService.execute(
        event.aggregateId,
      );

    // 02: Update the saga step view model with status change data
    existingSagaStepViewModel.update({
      status: event.data.status,
      startDate: event.data.startDate,
      endDate: event.data.endDate,
      errorMessage: event.data.errorMessage,
    });

    // 03: Save the updated saga step view model
    await this.sagaStepReadRepository.save(existingSagaStepViewModel);
  }
}
