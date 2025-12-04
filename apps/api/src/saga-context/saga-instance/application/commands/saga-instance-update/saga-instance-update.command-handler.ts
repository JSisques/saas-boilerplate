import { SagaInstanceUpdateCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-update/saga-instance-update.command';
import { AssertSagaInstanceExistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-exists/assert-saga-instance-exists.service';
import { ISagaInstanceUpdateDto } from '@/saga-context/saga-instance/domain/dtos/entities/saga-instance-update/saga-instance-update.dto';
import {
  SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
  SagaInstanceWriteRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { BaseUpdateCommandHandler } from '@/shared/application/commands/update/base-update/base-update.command-handler';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SagaInstanceUpdateCommand)
export class SagaInstanceUpdateCommandHandler
  extends BaseUpdateCommandHandler<
    SagaInstanceUpdateCommand,
    ISagaInstanceUpdateDto
  >
  implements ICommandHandler<SagaInstanceUpdateCommand>
{
  protected readonly logger = new Logger(SagaInstanceUpdateCommandHandler.name);

  constructor(
    private readonly assertSagaInstanceExistsService: AssertSagaInstanceExistsService,
    private readonly eventBus: EventBus,
    @Inject(SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN)
    private readonly sagaInstanceWriteRepository: SagaInstanceWriteRepository,
  ) {
    super();
  }

  /**
   * Executes the update saga instance command
   *
   * @param command - The command to execute
   */
  async execute(command: SagaInstanceUpdateCommand): Promise<void> {
    this.logger.log(
      `Executing update saga instance command by id: ${command.id}`,
    );

    // 01: Check if the saga instance exists
    const existingSagaInstance =
      await this.assertSagaInstanceExistsService.execute(command.id.value);

    // 02: Extract update data excluding the id field
    const updateData = this.extractUpdateData(command, ['id']);
    this.logger.debug(`Update data: ${JSON.stringify(updateData)}`);

    // 03: Update the saga instance
    existingSagaInstance.update(updateData);

    // 04: Save the saga instance
    await this.sagaInstanceWriteRepository.save(existingSagaInstance);

    // 05: Publish the saga instance updated event
    await this.eventBus.publishAll(existingSagaInstance.getUncommittedEvents());
    await existingSagaInstance.commit();
  }
}
