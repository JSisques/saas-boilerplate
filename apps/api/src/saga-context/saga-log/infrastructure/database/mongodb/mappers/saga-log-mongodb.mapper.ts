import { SagaLogViewModelFactory } from '@/saga-context/saga-log/domain/factories/saga-log-view-model/saga-log-view-model.factory';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogMongoDbDto } from '@/saga-context/saga-log/infrastructure/database/mongodb/dtos/saga-log-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaLogMongoDBMapper {
  private readonly logger = new Logger(SagaLogMongoDBMapper.name);

  constructor(
    private readonly sagaLogViewModelFactory: SagaLogViewModelFactory,
  ) {}

  /**
   * Converts a MongoDB document to a saga log view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The saga log view model
   */
  toViewModel(doc: SagaLogMongoDbDto): SagaLogViewModel {
    this.logger.log(
      `Converting MongoDB document to saga log view model with id ${doc.id}`,
    );

    return this.sagaLogViewModelFactory.create({
      id: doc.id,
      sagaInstanceId: doc.sagaInstanceId,
      sagaStepId: doc.sagaStepId,
      type: doc.type,
      message: doc.message,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    });
  }

  /**
   * Converts a saga log view model to a MongoDB data
   *
   * @param sagaLogViewModel - The saga log view model to convert
   * @returns The MongoDB document
   */
  toMongoData(sagaLogViewModel: SagaLogViewModel): SagaLogMongoDbDto {
    this.logger.log(
      `Converting saga log view model with id ${sagaLogViewModel.id} to MongoDB document`,
    );

    return {
      id: sagaLogViewModel.id,
      sagaInstanceId: sagaLogViewModel.sagaInstanceId,
      sagaStepId: sagaLogViewModel.sagaStepId,
      type: sagaLogViewModel.type,
      message: sagaLogViewModel.message,
      createdAt: sagaLogViewModel.createdAt,
      updatedAt: sagaLogViewModel.updatedAt,
    };
  }
}
