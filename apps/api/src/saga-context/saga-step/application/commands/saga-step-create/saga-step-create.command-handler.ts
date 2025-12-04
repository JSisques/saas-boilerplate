import { AssertSagaStepNotExistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-not-exists/assert-saga-step-not-exists.service';
import { SagaStepAggregateFactory } from '@/saga-context/saga-step/domain/factories/saga-step-aggregate/saga-step-aggregate.factory';
import {
  SAGA_STEP_WRITE_REPOSITORY_TOKEN,
  SagaStepWriteRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { Inject, Logger } from '@nestjs/common';
import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { SagaStepCreateCommand } from './saga-step-create.command';

@CommandHandler(SagaStepCreateCommand)
export class SagaStepCreateCommandHandler
  implements ICommandHandler<SagaStepCreateCommand>
{
  private readonly logger = new Logger(SagaStepCreateCommandHandler.name);

  constructor(
    @Inject(SAGA_STEP_WRITE_REPOSITORY_TOKEN)
    private readonly sagaStepWriteRepository: SagaStepWriteRepository,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
    private readonly sagaStepAggregateFactory: SagaStepAggregateFactory,
    private readonly assertSagaStepNotExistsService: AssertSagaStepNotExistsService,
  ) {}

  /**
   * Executes the saga step create command
   *
   * @param command - The command to execute
   * @returns The created saga step id
   */
  async execute(command: SagaStepCreateCommand): Promise<string> {
    this.logger.log(
      `Executing saga step create command with id ${command.id.value}`,
    );

    // 01: Assert the saga step is not exists
    await this.assertSagaStepNotExistsService.execute(command.id.value);

    // 02: Create the saga step entity
    const sagaStep = this.sagaStepAggregateFactory.create({
      ...command,
      createdAt: new DateValueObject(new Date()),
      updatedAt: new DateValueObject(new Date()),
    });

    // 03: Mark the saga step as pending without generating an event
    sagaStep.markAsPending(false);

    // 04: Save the saga step entity
    await this.sagaStepWriteRepository.save(sagaStep);

    // 05: Publish all events
    await this.eventBus.publishAll(sagaStep.getUncommittedEvents());
    await sagaStep.commit();

    // 06: Return the saga step id
    return sagaStep.id.value;
  }
}
