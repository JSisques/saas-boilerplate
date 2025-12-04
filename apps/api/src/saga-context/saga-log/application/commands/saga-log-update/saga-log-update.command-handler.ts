import { SagaLogUpdateCommand } from '@/saga-context/saga-log/application/commands/saga-log-update/saga-log-update.command';
import { AssertSagaLogExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-exists/assert-saga-log-exists.service';
import { ISagaLogUpdateDto } from '@/saga-context/saga-log/domain/dtos/entities/saga-log-update/saga-log-update.dto';
import {
  SAGA_LOG_WRITE_REPOSITORY_TOKEN,
  SagaLogWriteRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { BaseUpdateCommandHandler } from '@/shared/application/commands/update/base-update/base-update.command-handler';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SagaLogUpdateCommand)
export class SagaLogUpdateCommandHandler
  extends BaseUpdateCommandHandler<SagaLogUpdateCommand, ISagaLogUpdateDto>
  implements ICommandHandler<SagaLogUpdateCommand>
{
  protected readonly logger = new Logger(SagaLogUpdateCommandHandler.name);

  constructor(
    private readonly assertSagaLogExistsService: AssertSagaLogExistsService,
    private readonly eventBus: EventBus,
    @Inject(SAGA_LOG_WRITE_REPOSITORY_TOKEN)
    private readonly sagaLogWriteRepository: SagaLogWriteRepository,
  ) {
    super();
  }

  /**
   * Executes the update saga log command
   *
   * @param command - The command to execute
   */
  async execute(command: SagaLogUpdateCommand): Promise<void> {
    this.logger.log(
      `Executing update saga log command by id: ${command.id.value}`,
    );

    // 01: Check if the saga log exists
    const existingSagaLog = await this.assertSagaLogExistsService.execute(
      command.id.value,
    );

    // 02: Extract update data excluding the id, sagaInstanceId and sagaStepId fields
    const updateData = this.extractUpdateData(command, [
      'id',
      'sagaInstanceId',
      'sagaStepId',
    ]);
    this.logger.debug(`Update data: ${JSON.stringify(updateData)}`);

    // 03: Update the saga log
    existingSagaLog.update(updateData);

    // 04: Save the saga log
    await this.sagaLogWriteRepository.save(existingSagaLog);

    // 05: Publish the saga log updated event
    await this.eventBus.publishAll(existingSagaLog.getUncommittedEvents());
    await existingSagaLog.commit();
  }
}
