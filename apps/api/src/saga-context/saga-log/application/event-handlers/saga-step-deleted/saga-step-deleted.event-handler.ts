import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaStepDeletedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-deleted/saga-step-deleted.event';
import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaStepDeletedEvent)
export class SagaStepDeletedEventHandler
  implements IEventHandler<SagaStepDeletedEvent>
{
  private readonly logger = new Logger(SagaStepDeletedEventHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Handles the SagaStepDeletedEvent event by creating a saga log.
   *
   * @param event - The SagaStepDeletedEvent event to handle.
   */
  async handle(event: SagaStepDeletedEvent) {
    this.logger.log(`Handling saga step deleted event: ${event.aggregateId}`);

    // 01: Create a saga log for the saga step deletion
    await this.commandBus.execute(
      new SagaLogCreateCommand({
        sagaInstanceId: event.data.sagaInstanceId,
        sagaStepId: event.aggregateId,
        type: SagaLogTypeEnum.INFO,
        message: `Saga step "${event.data.name}" deleted`,
      }),
    );
  }
}
