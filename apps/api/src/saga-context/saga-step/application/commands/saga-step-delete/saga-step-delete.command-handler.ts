import { SagaStepDeleteCommand } from '@/saga-context/saga-step/application/commands/saga-step-delete/saga-step-delete.command';
import { AssertSagaStepExistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-exists/assert-saga-step-exists.service';
import {
  SAGA_STEP_WRITE_REPOSITORY_TOKEN,
  SagaStepWriteRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SagaStepDeleteCommand)
export class SagaStepDeleteCommandHandler
  implements ICommandHandler<SagaStepDeleteCommand>
{
  private readonly logger = new Logger(SagaStepDeleteCommandHandler.name);

  constructor(
    @Inject(SAGA_STEP_WRITE_REPOSITORY_TOKEN)
    private readonly sagaStepWriteRepository: SagaStepWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertSagaStepExistsService: AssertSagaStepExistsService,
  ) {}

  /**
   * Executes the saga step delete command.
   *
   * @param command - The command to execute.
   * @returns The void.
   */
  async execute(command: SagaStepDeleteCommand): Promise<void> {
    this.logger.log(
      `Executing remove saga step command by id: ${command.id.value}`,
    );

    // 01: Check if the saga step exists
    const existingSagaStep = await this.assertSagaStepExistsService.execute(
      command.id.value,
    );

    // 02: Delete the saga step
    await existingSagaStep.delete();

    // 03: Delete the saga step from the repository
    await this.sagaStepWriteRepository.delete(existingSagaStep.id.value);

    // 04: Publish the saga step deleted event
    await this.eventBus.publishAll(existingSagaStep.getUncommittedEvents());
    await existingSagaStep.commit();
  }
}
