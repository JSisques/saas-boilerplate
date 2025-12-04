import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaInstanceStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-status-changed/saga-instance-status-changed.event';
import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaInstanceStatusChangedEvent)
export class SagaInstanceStatusChangedEventHandler
  implements IEventHandler<SagaInstanceStatusChangedEvent>
{
  private readonly logger = new Logger(
    SagaInstanceStatusChangedEventHandler.name,
  );

  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Handles the SagaInstanceStatusChangedEvent event by creating a saga log.
   *
   * @param event - The SagaInstanceStatusChangedEvent event to handle.
   */
  async handle(event: SagaInstanceStatusChangedEvent) {
    this.logger.log(
      `Handling saga instance status changed event: ${event.aggregateId}`,
    );

    // 01: Determine log type based on status
    let logType = SagaLogTypeEnum.INFO;
    if (
      event.data.status === 'FAILED' ||
      event.data.status === 'COMPENSATING'
    ) {
      logType = SagaLogTypeEnum.ERROR;
    } else if (
      event.data.status === 'RUNNING' ||
      event.data.status === 'STARTED'
    ) {
      logType = SagaLogTypeEnum.DEBUG;
    }

    // 02: Create a saga log for the saga instance status change
    await this.commandBus.execute(
      new SagaLogCreateCommand({
        sagaInstanceId: event.aggregateId,
        sagaStepId: event.aggregateId, // Using instance id as step id for instance-level logs
        type: logType,
        message: `Saga instance status changed to "${event.data.status}"`,
      }),
    );
  }
}
