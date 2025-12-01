import { SagaInstanceViewModelFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-view-model/saga-instance-view-model.factory';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { SagaInstanceMongoDbDto } from '@/saga-context/saga-instance/infrastructure/database/mongodb/dtos/saga-instance-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaInstanceMongoDBMapper {
  private readonly logger = new Logger(SagaInstanceMongoDBMapper.name);

  constructor(
    private readonly sagaInstanceViewModelFactory: SagaInstanceViewModelFactory,
  ) {}
  /**
   * Converts a MongoDB document to a saga instance view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The saga instance view model
   */
  toViewModel(doc: SagaInstanceMongoDbDto): SagaInstanceViewModel {
    this.logger.log(
      `Converting MongoDB document to saga instance view model with id ${doc.id}`,
    );

    return this.sagaInstanceViewModelFactory.create({
      id: doc.id,
      name: doc.name,
      status: doc.status,
      startDate: doc.startDate,
      endDate: doc.endDate,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    });
  }

  /**
   * Converts a saga instance view model to a MongoDB data
   *
   * @param sagaInstanceViewModel - The saga instance view model to convert
   * @returns The MongoDB document
   */
  toMongoData(
    sagaInstanceViewModel: SagaInstanceViewModel,
  ): SagaInstanceMongoDbDto {
    this.logger.log(
      `Converting saga instance view model with id ${sagaInstanceViewModel.id} to MongoDB document`,
    );

    return {
      id: sagaInstanceViewModel.id,
      name: sagaInstanceViewModel.name,
      status: sagaInstanceViewModel.status,
      startDate: sagaInstanceViewModel.startDate,
      endDate: sagaInstanceViewModel.endDate,
      createdAt: sagaInstanceViewModel.createdAt,
      updatedAt: sagaInstanceViewModel.updatedAt,
    };
  }
}
