import { AssertSagaStepViewModelExsistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-view-model-exsits/assert-saga-step-view-model-exsits.service';
import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepUpdatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-updated/saga-step-updated.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaStepUpdatedEvent)
export class SagaStepUpdatedEventHandler
  implements IEventHandler<SagaStepUpdatedEvent>
{
  private readonly logger = new Logger(SagaStepUpdatedEventHandler.name);

  constructor(
    @Inject(SAGA_STEP_READ_REPOSITORY_TOKEN)
    private readonly sagaStepReadRepository: SagaStepReadRepository,
    private readonly assertSagaStepViewModelExsistsService: AssertSagaStepViewModelExsistsService,
  ) {}

  /**
   * Handles the SagaStepUpdatedEvent event by updating the existing saga step view model.
   *
   * @param event - The SagaStepUpdatedEvent event to handle.
   */
  async handle(event: SagaStepUpdatedEvent) {
    this.logger.log(`Handling saga step updated event: ${event.aggregateId}`);

    // 01: Assert the saga step view model exists
    const existingSagaStepViewModel =
      await this.assertSagaStepViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Update the existing view model with new data
    existingSagaStepViewModel.update(event.data);

    // 03: Save the updated saga step view model
    await this.sagaStepReadRepository.save(existingSagaStepViewModel);
  }
}
