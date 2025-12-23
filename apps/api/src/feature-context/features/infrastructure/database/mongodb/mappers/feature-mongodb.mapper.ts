import { FeatureViewModelFactory } from '@/feature-context/features/domain/factories/feature-view-model/feature-view-model.factory';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { FeatureMongoDbDto } from '@/feature-context/features/infrastructure/database/mongodb/dtos/feature-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FeatureMongoDBMapper {
  private readonly logger = new Logger(FeatureMongoDBMapper.name);

  constructor(
    private readonly featureViewModelFactory: FeatureViewModelFactory,
  ) {}

  /**
   * Converts a MongoDB document to a feature view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The feature view model
   */
  toViewModel(doc: FeatureMongoDbDto): FeatureViewModel {
    this.logger.log(
      `Converting MongoDB document to feature view model with id ${doc.id}`,
    );

    return this.featureViewModelFactory.create({
      id: doc.id,
      key: doc.key,
      name: doc.name,
      description: doc.description,
      status: doc.status,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    });
  }

  /**
   * Converts a feature view model to a MongoDB document
   *
   * @param featureViewModel - The feature view model to convert
   * @returns The MongoDB document
   */
  toMongoData(featureViewModel: FeatureViewModel): FeatureMongoDbDto {
    this.logger.log(
      `Converting feature view model with id ${featureViewModel.id} to MongoDB document`,
    );

    return {
      id: featureViewModel.id,
      key: featureViewModel.key,
      name: featureViewModel.name,
      description: featureViewModel.description,
      status: featureViewModel.status,
      createdAt: featureViewModel.createdAt,
      updatedAt: featureViewModel.updatedAt,
    };
  }
}
