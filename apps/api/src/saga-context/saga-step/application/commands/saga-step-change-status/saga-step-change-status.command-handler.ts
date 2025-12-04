import { AssertSagaStepExistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-exists/assert-saga-step-exists.service';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import {
  SAGA_STEP_WRITE_REPOSITORY_TOKEN,
  SagaStepWriteRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SagaStepChangeStatusCommand } from './saga-step-change-status.command';

@CommandHandler(SagaStepChangeStatusCommand)
export class SagaStepChangeStatusCommandHandler
  implements ICommandHandler<SagaStepChangeStatusCommand>
{
  private readonly logger = new Logger(SagaStepChangeStatusCommandHandler.name);

  constructor(
    @Inject(SAGA_STEP_WRITE_REPOSITORY_TOKEN)
    private readonly sagaStepWriteRepository: SagaStepWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertSagaStepExistsService: AssertSagaStepExistsService,
  ) {}

  /**
   * Executes the saga step change status command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: SagaStepChangeStatusCommand): Promise<void> {
    this.logger.log(
      `Executing saga step change status command with id ${command.id.value} to status ${command.status.value}`,
    );

    // 01: Assert the saga step exists
    const existingSagaStep = await this.assertSagaStepExistsService.execute(
      command.id.value,
    );

    // 02: Change the saga step status based on the provided status
    switch (command.status.value) {
      case SagaStepStatusEnum.PENDING:
        existingSagaStep.markAsPending();
        break;
      case SagaStepStatusEnum.STARTED:
        existingSagaStep.markAsStarted();
        break;
      case SagaStepStatusEnum.RUNNING:
        existingSagaStep.markAsRunning();
        break;
      case SagaStepStatusEnum.COMPLETED:
        existingSagaStep.markAsCompleted();
        break;
      case SagaStepStatusEnum.FAILED:
        existingSagaStep.markAsFailed();
        break;
      default:
        throw new Error(
          `Unknown status: ${command.status.value}. Cannot change saga step status.`,
        );
    }

    // 03: Save the saga step entity
    await this.sagaStepWriteRepository.save(existingSagaStep);

    // 04: Publish all events
    await this.eventBus.publishAll(existingSagaStep.getUncommittedEvents());
    await existingSagaStep.commit();
  }
}
