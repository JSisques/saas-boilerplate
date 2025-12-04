import { SagaLogDeleteCommand } from '@/saga-context/saga-log/application/commands/saga-log-delete/saga-log-delete.command';
import { AssertSagaLogExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-exists/assert-saga-log-exists.service';
import {
  SAGA_LOG_WRITE_REPOSITORY_TOKEN,
  SagaLogWriteRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SagaLogDeleteCommand)
export class SagaLogDeleteCommandHandler
  implements ICommandHandler<SagaLogDeleteCommand>
{
  private readonly logger = new Logger(SagaLogDeleteCommandHandler.name);

  constructor(
    @Inject(SAGA_LOG_WRITE_REPOSITORY_TOKEN)
    private readonly sagaLogWriteRepository: SagaLogWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertSagaLogExistsService: AssertSagaLogExistsService,
  ) {}

  /**
   * Executes the saga log delete command.
   *
   * @param command - The command to execute.
   * @returns The void.
   */
  async execute(command: SagaLogDeleteCommand): Promise<void> {
    this.logger.log(
      `Executing remove saga log command by id: ${command.id.value}`,
    );

    // 01: Check if the saga log exists
    const existingSagaLog = await this.assertSagaLogExistsService.execute(
      command.id.value,
    );

    // 02: Delete the saga log
    await existingSagaLog.delete();

    // 03: Delete the saga log from the repository
    await this.sagaLogWriteRepository.delete(existingSagaLog.id.value);

    // 04: Publish the saga log deleted event
    await this.eventBus.publishAll(existingSagaLog.getUncommittedEvents());
    await existingSagaLog.commit();
  }
}
