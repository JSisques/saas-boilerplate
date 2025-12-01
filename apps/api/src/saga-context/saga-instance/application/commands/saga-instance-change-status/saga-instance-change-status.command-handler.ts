import { AssertSagaInstanceExsistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-exsits/assert-saga-instance-exsits.service';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import {
  SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
  SagaInstanceWriteRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SagaInstanceChangeStatusCommand } from './saga-instance-change-status.command';

@CommandHandler(SagaInstanceChangeStatusCommand)
export class SagaInstanceChangeStatusCommandHandler
  implements ICommandHandler<SagaInstanceChangeStatusCommand>
{
  private readonly logger = new Logger(
    SagaInstanceChangeStatusCommandHandler.name,
  );

  constructor(
    @Inject(SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN)
    private readonly sagaInstanceWriteRepository: SagaInstanceWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertSagaInstanceExsistsService: AssertSagaInstanceExsistsService,
  ) {}

  /**
   * Executes the saga instance change status command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: SagaInstanceChangeStatusCommand): Promise<void> {
    this.logger.log(
      `Executing saga instance change status command with id ${command.id.value} to status ${command.status.value}`,
    );

    // 01: Assert the saga instance exists
    const existingSagaInstance =
      await this.assertSagaInstanceExsistsService.execute(command.id.value);

    // 02: Change the saga instance status based on the provided status
    switch (command.status.value) {
      case SagaInstanceStatusEnum.PENDING:
        existingSagaInstance.markAsPending();
        break;
      case SagaInstanceStatusEnum.STARTED:
        existingSagaInstance.markAsStarted();
        break;
      case SagaInstanceStatusEnum.RUNNING:
        existingSagaInstance.markAsRunning();
        break;
      case SagaInstanceStatusEnum.COMPLETED:
        existingSagaInstance.markAsCompleted();
        break;
      case SagaInstanceStatusEnum.FAILED:
        existingSagaInstance.markAsFailed();
        break;
      case SagaInstanceStatusEnum.COMPENSATING:
        existingSagaInstance.markAsCompensating();
        break;
      case SagaInstanceStatusEnum.COMPENSATED:
        existingSagaInstance.markAsCompensated();
        break;
      default:
        throw new Error(
          `Unknown status: ${command.status.value}. Cannot change saga instance status.`,
        );
    }

    // 03: Save the saga instance entity
    await this.sagaInstanceWriteRepository.save(existingSagaInstance);

    // 04: Publish all events
    await this.eventBus.publishAll(existingSagaInstance.getUncommittedEvents());
    await existingSagaInstance.commit();
  }
}
