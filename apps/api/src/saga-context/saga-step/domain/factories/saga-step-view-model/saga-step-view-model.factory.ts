import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { ISagaStepCreateViewModelDto } from '@/saga-context/saga-step/domain/dtos/view-models/saga-step-create/saga-step-create-view-model.dto';
import { SagaStepPrimitives } from '@/saga-context/saga-step/domain/primitives/saga-step.primitives';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable, Logger } from '@nestjs/common';

/**
 * This factory class is used to create a new saga step view model.
 */
@Injectable()
export class SagaStepViewModelFactory
  implements
    IReadFactory<
      SagaStepViewModel,
      ISagaStepCreateViewModelDto,
      SagaStepAggregate,
      SagaStepPrimitives
    >
{
  private readonly logger = new Logger(SagaStepViewModelFactory.name);

  /**
   * Creates a new tenant view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: ISagaStepCreateViewModelDto): SagaStepViewModel {
    this.logger.log(`Creating saga step view model from DTO: ${data}`);
    return new SagaStepViewModel(data);
  }

  /**
   * Creates a new saga step view model from a saga step primitive.
   *
   * @param sagaStepPrimitives - The saga step primitive to create the view model from.
   * @returns The saga step view model.
   */
  public fromPrimitives(
    sagaStepPrimitives: SagaStepPrimitives,
  ): SagaStepViewModel {
    this.logger.log(
      `Creating saga step view model from primitives: ${sagaStepPrimitives}`,
    );

    return new SagaStepViewModel({
      id: sagaStepPrimitives.id,
      sagaInstanceId: sagaStepPrimitives.sagaInstanceId,
      name: sagaStepPrimitives.name,
      order: sagaStepPrimitives.order,
      status: sagaStepPrimitives.status,
      errorMessage: sagaStepPrimitives.errorMessage,
      retryCount: sagaStepPrimitives.retryCount,
      maxRetries: sagaStepPrimitives.maxRetries,
      payload: sagaStepPrimitives.payload,
      result: sagaStepPrimitives.result,
      startDate: sagaStepPrimitives.startDate,
      endDate: sagaStepPrimitives.endDate,
      createdAt: sagaStepPrimitives.createdAt,
      updatedAt: sagaStepPrimitives.updatedAt,
    });
  }
  /**
   * Creates a new saga step view model from a saga step aggregate.
   *
   * @param sagaStepAggregate - The saga step aggregate to create the view model from.
   * @returns The saga step view model.
   */
  public fromAggregate(
    sagaStepAggregate: SagaStepAggregate,
  ): SagaStepViewModel {
    this.logger.log(
      `Creating saga step view model from aggregate: ${sagaStepAggregate}`,
    );

    return new SagaStepViewModel({
      id: sagaStepAggregate.id.value,
      sagaInstanceId: sagaStepAggregate.sagaInstanceId.value,
      name: sagaStepAggregate.name.value,
      order: sagaStepAggregate.order.value,
      status: sagaStepAggregate.status.value,
      startDate: sagaStepAggregate.startDate.value,
      endDate: sagaStepAggregate.endDate.value,
      errorMessage: sagaStepAggregate.errorMessage.value,
      retryCount: sagaStepAggregate.retryCount.value,
      maxRetries: sagaStepAggregate.maxRetries.value,
      payload: sagaStepAggregate.payload.value,
      result: sagaStepAggregate.result.value,
      createdAt: sagaStepAggregate.createdAt.value,
      updatedAt: sagaStepAggregate.updatedAt.value,
    });
  }
}
