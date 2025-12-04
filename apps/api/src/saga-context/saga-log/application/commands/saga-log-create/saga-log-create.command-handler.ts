import { AssertSagaLogNotExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-not-exists/assert-saga-log-not-exists.service';
import { SagaLogAggregateFactory } from '@/saga-context/saga-log/domain/factories/saga-log-aggregate/saga-log-aggregate.factory';
import {
  SAGA_LOG_WRITE_REPOSITORY_TOKEN,
  SagaLogWriteRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SagaLogCreateCommand } from './saga-log-create.command';

@CommandHandler(SagaLogCreateCommand)
export class SagaLogCreateCommandHandler
  implements ICommandHandler<SagaLogCreateCommand>
{
  private readonly logger = new Logger(SagaLogCreateCommandHandler.name);

  constructor(
    @Inject(SAGA_LOG_WRITE_REPOSITORY_TOKEN)
    private readonly sagaLogWriteRepository: SagaLogWriteRepository,
    private readonly eventBus: EventBus,
    private readonly sagaLogAggregateFactory: SagaLogAggregateFactory,
    private readonly assertSagaLogNotExistsService: AssertSagaLogNotExistsService,
  ) {}

  /**
   * Executes the saga log create command
   *
   * @param command - The command to execute
   * @returns The created saga log id
   */
  async execute(command: SagaLogCreateCommand): Promise<string> {
    this.logger.log(
      `Executing saga log create command with id ${command.id.value}`,
    );

    // 01: Assert the saga log is not exists
    await this.assertSagaLogNotExistsService.execute(command.id.value);

    // 02: Create the saga log entity
    const sagaLog = this.sagaLogAggregateFactory.create({
      ...command,
      createdAt: new DateValueObject(new Date()),
      updatedAt: new DateValueObject(new Date()),
    });

    // 03: Save the saga log entity
    await this.sagaLogWriteRepository.save(sagaLog);

    // 04: Publish all events
    await this.eventBus.publishAll(sagaLog.getUncommittedEvents());
    await sagaLog.commit();

    // 05: Return the saga log id
    return sagaLog.id.value;
  }
}
