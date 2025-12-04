import { SagaStepViewModelFactory } from '@/saga-context/saga-step/domain/factories/saga-step-view-model/saga-step-view-model.factory';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepMongoDbDto } from '@/saga-context/saga-step/infrastructure/database/mongodb/dtos/saga-step-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaStepMongoDBMapper {
  private readonly logger = new Logger(SagaStepMongoDBMapper.name);

  constructor(
    private readonly sagaStepViewModelFactory: SagaStepViewModelFactory,
  ) {}
  /**
   * Converts a MongoDB document to a saga step view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The saga step view model
   */
  toViewModel(doc: SagaStepMongoDbDto): SagaStepViewModel {
    this.logger.log(
      `Converting MongoDB document to saga step view model with id ${doc.id}`,
    );

    return this.sagaStepViewModelFactory.create({
      id: doc.id,
      sagaInstanceId: doc.sagaInstanceId,
      name: doc.name,
      order: doc.order,
      status: doc.status,
      startDate: doc.startDate,
      endDate: doc.endDate,
      errorMessage: doc.errorMessage,
      retryCount: doc.retryCount,
      maxRetries: doc.maxRetries,
      payload: doc.payload,
      result: doc.result,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    });
  }

  /**
   * Converts a saga step view model to a MongoDB data
   *
   * @param sagaStepViewModel - The saga step view model to convert
   * @returns The MongoDB document
   */
  toMongoData(sagaStepViewModel: SagaStepViewModel): SagaStepMongoDbDto {
    this.logger.log(
      `Converting saga step view model with id ${sagaStepViewModel.id} to MongoDB document`,
    );

    return {
      id: sagaStepViewModel.id,
      sagaInstanceId: sagaStepViewModel.sagaInstanceId,
      name: sagaStepViewModel.name,
      order: sagaStepViewModel.order,
      status: sagaStepViewModel.status,
      startDate: sagaStepViewModel.startDate,
      endDate: sagaStepViewModel.endDate,
      errorMessage: sagaStepViewModel.errorMessage,
      retryCount: sagaStepViewModel.retryCount,
      maxRetries: sagaStepViewModel.maxRetries,
      payload: sagaStepViewModel.payload,
      result: sagaStepViewModel.result,
      createdAt: sagaStepViewModel.createdAt,
      updatedAt: sagaStepViewModel.updatedAt,
    };
  }
}
