import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaInstanceDeletedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-deleted/saga-instance-deleted.event';
import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaInstanceDeletedEvent)
export class SagaInstanceDeletedEventHandler
  implements IEventHandler<SagaInstanceDeletedEvent>
{
  private readonly logger = new Logger(SagaInstanceDeletedEventHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Handles the SagaInstanceDeletedEvent event by creating a saga log.
   *
   * @param event - The SagaInstanceDeletedEvent event to handle.
   */
  async handle(event: SagaInstanceDeletedEvent) {
    this.logger.log(
      `Handling saga instance deleted event: ${event.aggregateId}`,
    );

    // 01: Create a saga log for the saga instance deletion
    await this.commandBus.execute(
      new SagaLogCreateCommand({
        sagaInstanceId: event.aggregateId,
        sagaStepId: event.aggregateId, // Using instance id as step id for instance-level logs
        type: SagaLogTypeEnum.INFO,
        message: `Saga instance "${event.data.name}" deleted`,
      }),
    );
  }
}
