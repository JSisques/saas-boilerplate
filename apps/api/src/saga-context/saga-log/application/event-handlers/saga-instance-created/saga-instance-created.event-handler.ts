import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaInstanceCreatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-created/saga-instance-created.event';
import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaInstanceCreatedEvent)
export class SagaInstanceCreatedEventHandler
  implements IEventHandler<SagaInstanceCreatedEvent>
{
  private readonly logger = new Logger(SagaInstanceCreatedEventHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Handles the SagaInstanceCreatedEvent event by creating a saga log.
   *
   * @param event - The SagaInstanceCreatedEvent event to handle.
   */
  async handle(event: SagaInstanceCreatedEvent) {
    this.logger.log(
      `Handling saga instance created event: ${event.aggregateId}`,
    );

    // 01: Create a saga log for the saga instance creation
    // Note: sagaStepId is set to the same as sagaInstanceId since there's no step yet
    await this.commandBus.execute(
      new SagaLogCreateCommand({
        sagaInstanceId: event.aggregateId,
        sagaStepId: event.aggregateId,
        type: SagaLogTypeEnum.INFO,
        message: `Saga instance "${event.data.name}" created with status "${event.data.status}"`,
      }),
    );
  }
}
