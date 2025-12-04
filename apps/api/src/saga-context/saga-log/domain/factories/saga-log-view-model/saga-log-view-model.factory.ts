import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { ISagaLogCreateViewModelDto } from '@/saga-context/saga-log/domain/dtos/view-models/saga-log-create/saga-log-create-view-model.dto';
import { SagaLogPrimitives } from '@/saga-context/saga-log/domain/primitives/saga-log.primitives';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable, Logger } from '@nestjs/common';

/**
 * This factory class is used to create a new saga log view model.
 */
@Injectable()
export class SagaLogViewModelFactory
  implements
    IReadFactory<
      SagaLogViewModel,
      ISagaLogCreateViewModelDto,
      SagaLogAggregate,
      SagaLogPrimitives
    >
{
  private readonly logger = new Logger(SagaLogViewModelFactory.name);

  /**
   * Creates a new saga log view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: ISagaLogCreateViewModelDto): SagaLogViewModel {
    this.logger.log(`Creating saga log view model from DTO: ${data}`);
    return new SagaLogViewModel(data);
  }

  /**
   * Creates a new saga log view model from a saga log primitive.
   *
   * @param sagaLogPrimitives - The saga log primitive to create the view model from.
   * @returns The saga log view model.
   */
  public fromPrimitives(
    sagaLogPrimitives: SagaLogPrimitives,
  ): SagaLogViewModel {
    this.logger.log(
      `Creating saga log view model from primitives: ${sagaLogPrimitives}`,
    );

    return new SagaLogViewModel({
      id: sagaLogPrimitives.id,
      sagaInstanceId: sagaLogPrimitives.sagaInstanceId,
      sagaStepId: sagaLogPrimitives.sagaStepId,
      type: sagaLogPrimitives.type,
      message: sagaLogPrimitives.message,
      createdAt: sagaLogPrimitives.createdAt,
      updatedAt: sagaLogPrimitives.updatedAt,
    });
  }

  /**
   * Creates a new saga log view model from a saga log aggregate.
   *
   * @param sagaLogAggregate - The saga log aggregate to create the view model from.
   * @returns The saga log view model.
   */
  public fromAggregate(sagaLogAggregate: SagaLogAggregate): SagaLogViewModel {
    this.logger.log(
      `Creating saga log view model from aggregate: ${sagaLogAggregate}`,
    );

    return new SagaLogViewModel({
      id: sagaLogAggregate.id.value,
      sagaInstanceId: sagaLogAggregate.sagaInstanceId.value,
      sagaStepId: sagaLogAggregate.sagaStepId.value,
      type: sagaLogAggregate.type.value,
      message: sagaLogAggregate.message.value,
      createdAt: sagaLogAggregate.createdAt.value,
      updatedAt: sagaLogAggregate.updatedAt.value,
    });
  }
}
