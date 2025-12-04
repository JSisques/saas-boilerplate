import { AssertSagaInstanceNotExistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-not-exists/assert-saga-instance-not-exists.service';
import { SagaInstanceAggregateFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-aggregate/saga-instance-aggregate.factory';
import {
  SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
  SagaInstanceWriteRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { Inject, Logger } from '@nestjs/common';
import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { SagaInstanceCreateCommand } from './saga-instance-create.command';

@CommandHandler(SagaInstanceCreateCommand)
export class SagaInstanceCreateCommandHandler
  implements ICommandHandler<SagaInstanceCreateCommand>
{
  private readonly logger = new Logger(SagaInstanceCreateCommandHandler.name);

  constructor(
    @Inject(SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN)
    private readonly sagaInstanceWriteRepository: SagaInstanceWriteRepository,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
    private readonly sagaInstanceAggregateFactory: SagaInstanceAggregateFactory,
    private readonly assertSagaInstanceNotExistsService: AssertSagaInstanceNotExistsService,
  ) {}

  /**
   * Executes the saga instance create command
   *
   * @param command - The command to execute
   * @returns The created saga instance id
   */
  async execute(command: SagaInstanceCreateCommand): Promise<string> {
    this.logger.log(
      `Executing saga instance create command with id ${command.id.value}`,
    );

    // 01: Assert the saga instance is not exsists
    await this.assertSagaInstanceNotExistsService.execute(command.id.value);

    // 02: Create the saga instance entity
    const sagaInstance = this.sagaInstanceAggregateFactory.create({
      ...command,
      createdAt: new DateValueObject(new Date()),
      updatedAt: new DateValueObject(new Date()),
    });

    // 03: Mark the saga instance as pending without generating an event
    sagaInstance.markAsPending(false);

    // 04: Save the saga instance entity
    await this.sagaInstanceWriteRepository.save(sagaInstance);

    // 05: Publish all events
    await this.eventBus.publishAll(sagaInstance.getUncommittedEvents());
    await sagaInstance.commit();

    // 06: Return the saga instance id
    return sagaInstance.id.value;
  }
}
