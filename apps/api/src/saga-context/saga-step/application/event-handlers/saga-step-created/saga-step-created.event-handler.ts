import { SagaStepViewModelFactory } from '@/saga-context/saga-step/domain/factories/saga-step-view-model/saga-step-view-model.factory';
import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepCreatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-created/saga-step-created.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaStepCreatedEvent)
export class SagaStepCreatedEventHandler
  implements IEventHandler<SagaStepCreatedEvent>
{
  private readonly logger = new Logger(SagaStepCreatedEventHandler.name);

  constructor(
    @Inject(SAGA_STEP_READ_REPOSITORY_TOKEN)
    private readonly sagaStepReadRepository: SagaStepReadRepository,
    private readonly sagaStepViewModelFactory: SagaStepViewModelFactory,
  ) {}

  /**
   * Handles the SagaStepCreatedEvent event by creating a new saga step view model.
   *
   * @param event - The SagaStepCreatedEvent event to handle.
   */
  async handle(event: SagaStepCreatedEvent) {
    this.logger.log(`Handling saga step created event: ${event.aggregateId}`);

    // 01: Create the saga step view model
    const sagaStepCreatedViewModel: SagaStepViewModel =
      this.sagaStepViewModelFactory.fromPrimitives(event.data);

    // 02: Save the saga step view model
    await this.sagaStepReadRepository.save(sagaStepCreatedViewModel);
  }
}
