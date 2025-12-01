import { AssertSagaInstanceViewModelExsistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-view-model-exsits/assert-saga-instance-view-model-exsits.service';
import {
  SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
  SagaInstanceReadRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SagaInstanceDeletedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-deleted/saga-instance-deleted.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaInstanceDeletedEvent)
export class SagaInstanceDeletedEventHandler
  implements IEventHandler<SagaInstanceDeletedEvent>
{
  private readonly logger = new Logger(SagaInstanceDeletedEventHandler.name);

  constructor(
    @Inject(SAGA_INSTANCE_READ_REPOSITORY_TOKEN)
    private readonly sagaInstanceReadRepository: SagaInstanceReadRepository,
    private readonly assertSagaInstanceViewModelExsistsService: AssertSagaInstanceViewModelExsistsService,
  ) {}

  /**
   * Handles the SagaInstanceDeletedEvent event by removing the existing saga instance view model.
   *
   * @param event - The SagaInstanceDeletedEvent event to handle.
   */
  async handle(event: SagaInstanceDeletedEvent) {
    this.logger.log(
      `Handling saga instance deleted event: ${event.aggregateId}`,
    );

    // 01: Assert the saga instance view model exists
    const existingSagaInstanceViewModel =
      await this.assertSagaInstanceViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Delete the saga instance view model
    await this.sagaInstanceReadRepository.delete(
      existingSagaInstanceViewModel.id,
    );
  }
}
