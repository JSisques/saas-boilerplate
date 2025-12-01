import { AssertSagaInstanceViewModelExsistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-view-model-exsits/assert-saga-instance-view-model-exsits.service';
import { SagaInstanceViewModelFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-view-model/saga-instance-view-model.factory';
import {
  SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
  SagaInstanceReadRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SagaInstanceStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-status-changed/saga-instance-status-changed.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaInstanceStatusChangedEvent)
export class SagaInstanceStatusChangedEventHandler
  implements IEventHandler<SagaInstanceStatusChangedEvent>
{
  private readonly logger = new Logger(
    SagaInstanceStatusChangedEventHandler.name,
  );

  constructor(
    @Inject(SAGA_INSTANCE_READ_REPOSITORY_TOKEN)
    private readonly sagaInstanceReadRepository: SagaInstanceReadRepository,
    private readonly sagaInstanceViewModelFactory: SagaInstanceViewModelFactory,
    private readonly assertSagaInstanceViewModelExsistsService: AssertSagaInstanceViewModelExsistsService,
  ) {}

  /**
   * Handles the SagaInstanceCreatedEvent event by creating a new saga instance view model.
   *
   * @param event - The SagaInstanceCreatedEvent event to handle.
   */
  async handle(event: SagaInstanceStatusChangedEvent) {
    this.logger.log(
      `Handling saga instance status changed event: ${event.aggregateId}`,
    );

    // 01: Assert the saga instance view model exists
    const existingSagaInstanceViewModel =
      await this.assertSagaInstanceViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Save the saga instance view model
    existingSagaInstanceViewModel.update({
      status: event.data.status,
      startDate: event.data.startDate,
      endDate: event.data.endDate,
    });

    // 03: Save the updated saga instance view model
    await this.sagaInstanceReadRepository.save(existingSagaInstanceViewModel);
  }
}
