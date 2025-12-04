import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaStepStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-status-changed/saga-step-status-changed.event';
import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SagaStepStatusChangedEvent)
export class SagaStepStatusChangedEventHandler
  implements IEventHandler<SagaStepStatusChangedEvent>
{
  private readonly logger = new Logger(SagaStepStatusChangedEventHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Handles the SagaStepStatusChangedEvent event by creating a saga log.
   *
   * @param event - The SagaStepStatusChangedEvent event to handle.
   */
  async handle(event: SagaStepStatusChangedEvent) {
    this.logger.log(
      `Handling saga step status changed event: ${event.aggregateId}`,
    );

    // 01: Determine log type based on status
    let logType = SagaLogTypeEnum.INFO;
    if (event.data.status === 'FAILED') {
      logType = SagaLogTypeEnum.ERROR;
    } else if (
      event.data.status === 'RUNNING' ||
      event.data.status === 'STARTED'
    ) {
      logType = SagaLogTypeEnum.DEBUG;
    }

    // 02: Create a saga log for the saga step status change
    await this.commandBus.execute(
      new SagaLogCreateCommand({
        sagaInstanceId: event.data.sagaInstanceId,
        sagaStepId: event.aggregateId,
        type: logType,
        message: `Saga step status changed to "${event.data.status}"${
          event.data.errorMessage ? `. Error: ${event.data.errorMessage}` : ''
        }`,
      }),
    );
  }
}
