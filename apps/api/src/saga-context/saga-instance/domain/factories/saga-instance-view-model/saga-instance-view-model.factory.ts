import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { ISagaInstanceCreateViewModelDto } from '@/saga-context/saga-instance/domain/dtos/view-models/saga-instance-create/saga-instance-create-view-model.dto';
import { SagaInstancePrimitives } from '@/saga-context/saga-instance/domain/primitives/saga-instance.primitives';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable, Logger } from '@nestjs/common';

/**
 * This factory class is used to create a new saga instance view model.
 */
@Injectable()
export class SagaInstanceViewModelFactory
  implements
    IReadFactory<
      SagaInstanceViewModel,
      ISagaInstanceCreateViewModelDto,
      SagaInstanceAggregate,
      SagaInstancePrimitives
    >
{
  private readonly logger = new Logger(SagaInstanceViewModelFactory.name);

  /**
   * Creates a new tenant view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: ISagaInstanceCreateViewModelDto): SagaInstanceViewModel {
    this.logger.log(`Creating saga instance view model from DTO: ${data}`);
    return new SagaInstanceViewModel(data);
  }

  /**
   * Creates a new saga instance view model from a saga instance primitive.
   *
   * @param sagaInstancePrimitives - The saga instance primitive to create the view model from.
   * @returns The saga instance view model.
   */
  public fromPrimitives(
    sagaInstancePrimitives: SagaInstancePrimitives,
  ): SagaInstanceViewModel {
    this.logger.log(
      `Creating saga instance view model from primitives: ${sagaInstancePrimitives}`,
    );

    return new SagaInstanceViewModel({
      id: sagaInstancePrimitives.id,
      name: sagaInstancePrimitives.name,
      status: sagaInstancePrimitives.status,
      startDate: sagaInstancePrimitives.startDate,
      endDate: sagaInstancePrimitives.endDate,
      createdAt: sagaInstancePrimitives.createdAt,
      updatedAt: sagaInstancePrimitives.updatedAt,
    });
  }
  /**
   * Creates a new saga instance view model from a saga instance aggregate.
   *
   * @param sagaInstanceAggregate - The saga instance aggregate to create the view model from.
   * @returns The saga instance view model.
   */
  public fromAggregate(
    sagaInstanceAggregate: SagaInstanceAggregate,
  ): SagaInstanceViewModel {
    this.logger.log(
      `Creating saga instance view model from aggregate: ${sagaInstanceAggregate}`,
    );

    return new SagaInstanceViewModel({
      id: sagaInstanceAggregate.id.value,
      name: sagaInstanceAggregate.name.value,
      status: sagaInstanceAggregate.status.value,
      startDate: sagaInstanceAggregate.startDate?.value ?? null,
      endDate: sagaInstanceAggregate.endDate?.value ?? null,
      createdAt: sagaInstanceAggregate.createdAt.value,
      updatedAt: sagaInstanceAggregate.updatedAt.value,
    });
  }
}
