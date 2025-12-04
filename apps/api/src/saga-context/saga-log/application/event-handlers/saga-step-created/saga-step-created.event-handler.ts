import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SagaStepCreatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-created/saga-step-created.event';

@EventsHandler(SagaStepCreatedEvent)
export class SagaStepCreatedEventHandler
  implements IEventHandler<SagaStepCreatedEvent>
{
  private readonly logger = new Logger(SagaStepCreatedEventHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Handles the SagaStepCreatedEvent event by creating a saga log.
   *
   * @param event - The SagaStepCreatedEvent event to handle.
   */
  async handle(event: SagaStepCreatedEvent) {
    this.logger.log(`Handling saga step created event: ${event.aggregateId}`);

    // 01: Create a saga log for the saga step creation
    await this.commandBus.execute(
      new SagaLogCreateCommand({
        sagaInstanceId: event.data.sagaInstanceId,
        sagaStepId: event.aggregateId,
        type: SagaLogTypeEnum.INFO,
        message: `Saga step "${event.data.name}" created with status "${event.data.status}"`,
      }),
    );
  }
}
