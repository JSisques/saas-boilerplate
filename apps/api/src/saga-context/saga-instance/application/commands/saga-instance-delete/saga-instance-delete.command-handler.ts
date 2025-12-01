import { SagaInstanceDeleteCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-delete/saga-instance-delete.command';
import { AssertSagaInstanceExsistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-exsits/assert-saga-instance-exsits.service';
import {
  SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
  SagaInstanceWriteRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SagaInstanceDeleteCommand)
export class SagaInstanceDeleteCommandHandler
  implements ICommandHandler<SagaInstanceDeleteCommand>
{
  private readonly logger = new Logger(SagaInstanceDeleteCommandHandler.name);

  constructor(
    @Inject(SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN)
    private readonly sagaInstanceWriteRepository: SagaInstanceWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertSagaInstanceExsistsService: AssertSagaInstanceExsistsService,
  ) {}

  /**
   * Executes the saga instance delete command.
   *
   * @param command - The command to execute.
   * @returns The void.
   */
  async execute(command: SagaInstanceDeleteCommand): Promise<void> {
    this.logger.log(
      `Executing remove saga instance command by id: ${command.id}`,
    );

    // 01: Check if the saga instance exists
    const existingSagaInstance =
      await this.assertSagaInstanceExsistsService.execute(command.id.value);

    // 02: Delete the saga instance
    await existingSagaInstance.delete();

    // 04: Delete the saga instance from the repository
    await this.sagaInstanceWriteRepository.delete(
      existingSagaInstance.id.value,
    );

    // 05: Publish the saga instance deleted event
    await this.eventBus.publishAll(existingSagaInstance.getUncommittedEvents());
    await existingSagaInstance.commit();
  }
}
