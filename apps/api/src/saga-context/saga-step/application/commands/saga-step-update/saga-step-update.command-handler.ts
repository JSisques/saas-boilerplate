import { SagaStepUpdateCommand } from '@/saga-context/saga-step/application/commands/saga-step-update/saga-step-update.command';
import { AssertSagaStepExistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-exists/assert-saga-step-exists.service';
import { ISagaStepUpdateDto } from '@/saga-context/saga-step/domain/dtos/entities/saga-step-update/saga-step-update.dto';
import {
  SAGA_STEP_WRITE_REPOSITORY_TOKEN,
  SagaStepWriteRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { BaseUpdateCommandHandler } from '@/shared/application/commands/update/base-update/base-update.command-handler';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SagaStepUpdateCommand)
export class SagaStepUpdateCommandHandler
  extends BaseUpdateCommandHandler<SagaStepUpdateCommand, ISagaStepUpdateDto>
  implements ICommandHandler<SagaStepUpdateCommand>
{
  protected readonly logger = new Logger(SagaStepUpdateCommandHandler.name);

  constructor(
    private readonly assertSagaStepExistsService: AssertSagaStepExistsService,
    private readonly eventBus: EventBus,
    @Inject(SAGA_STEP_WRITE_REPOSITORY_TOKEN)
    private readonly sagaStepWriteRepository: SagaStepWriteRepository,
  ) {
    super();
  }

  /**
   * Executes the update saga step command
   *
   * @param command - The command to execute
   */
  async execute(command: SagaStepUpdateCommand): Promise<void> {
    this.logger.log(
      `Executing update saga step command by id: ${command.id.value}`,
    );

    // 01: Check if the saga step exists
    const existingSagaStep = await this.assertSagaStepExistsService.execute(
      command.id.value,
    );

    // 02: Extract update data excluding the id and sagaInstanceId fields
    const updateData = this.extractUpdateData(command, [
      'id',
      'sagaInstanceId',
    ]);
    this.logger.debug(`Update data: ${JSON.stringify(updateData)}`);

    // 03: Update the saga step
    existingSagaStep.update(updateData);

    // 04: Save the saga step
    await this.sagaStepWriteRepository.save(existingSagaStep);

    // 05: Publish the saga step updated event
    await this.eventBus.publishAll(existingSagaStep.getUncommittedEvents());
    await existingSagaStep.commit();
  }
}
