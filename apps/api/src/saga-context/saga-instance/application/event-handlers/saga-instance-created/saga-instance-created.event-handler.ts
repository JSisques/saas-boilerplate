import { SagaInstanceViewModelFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-view-model/saga-instance-view-model.factory';
import {
  SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
  SagaInstanceReadRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { SagaInstanceCreatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-created/saga-instance-created.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaInstanceCreatedEvent)
export class SagaInstanceCreatedEventHandler
  implements IEventHandler<SagaInstanceCreatedEvent>
{
  private readonly logger = new Logger(SagaInstanceCreatedEventHandler.name);

  constructor(
    @Inject(SAGA_INSTANCE_READ_REPOSITORY_TOKEN)
    private readonly sagaInstanceReadRepository: SagaInstanceReadRepository,
    private readonly sagaInstanceViewModelFactory: SagaInstanceViewModelFactory,
  ) {}

  /**
   * Handles the SagaInstanceCreatedEvent event by creating a new saga instance view model.
   *
   * @param event - The SagaInstanceCreatedEvent event to handle.
   */
  async handle(event: SagaInstanceCreatedEvent) {
    this.logger.log(
      `Handling saga instance created event: ${event.aggregateId}`,
    );

    // 01: Create the saga instance view model
    const sagaInstanceCreatedViewModel: SagaInstanceViewModel =
      this.sagaInstanceViewModelFactory.fromPrimitives(event.data);

    // 02: Save the saga instance view model
    await this.sagaInstanceReadRepository.save(sagaInstanceCreatedViewModel);
  }
}
