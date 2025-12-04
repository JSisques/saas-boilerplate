import { AssertSagaInstanceViewModelExistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-view-model-exists/assert-saga-instance-view-model-exists.service';
import {
  SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
  SagaInstanceReadRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SagaInstanceUpdatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-updated/saga-instance-updated.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaInstanceUpdatedEvent)
export class SagaInstanceUpdatedEventHandler
  implements IEventHandler<SagaInstanceUpdatedEvent>
{
  private readonly logger = new Logger(SagaInstanceUpdatedEventHandler.name);

  constructor(
    @Inject(SAGA_INSTANCE_READ_REPOSITORY_TOKEN)
    private readonly sagaInstanceReadRepository: SagaInstanceReadRepository,
    private readonly assertSagaInstanceViewModelExistsService: AssertSagaInstanceViewModelExistsService,
  ) {}

  /**
   * Handles the SagaInstanceUpdatedEvent event by updating the existing saga instance view model.
   *
   * @param event - The SagaInstanceUpdatedEvent event to handle.
   */
  async handle(event: SagaInstanceUpdatedEvent) {
    this.logger.log(
      `Handling saga instance updated event: ${event.aggregateId}`,
    );

    // 01: Assert the saga instance view model exists
    const existingSagaInstanceViewModel =
      await this.assertSagaInstanceViewModelExistsService.execute(
        event.aggregateId,
      );

    // 02: Update the existing view model with new data
    existingSagaInstanceViewModel.update(event.data);

    // 03: Save the updated saga instance view model
    await this.sagaInstanceReadRepository.save(existingSagaInstanceViewModel);
  }
}
