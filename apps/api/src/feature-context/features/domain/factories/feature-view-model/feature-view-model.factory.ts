import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { IFeatureCreateViewModelDto } from '@/feature-context/features/domain/dtos/view-models/feature-create/feature-create-view-model.dto';
import { FeaturePrimitives } from '@/feature-context/features/domain/primitives/feature.primitives';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable, Logger } from '@nestjs/common';

/**
 * This factory class is used to create a new feature view model.
 */
@Injectable()
export class FeatureViewModelFactory
  implements
    IReadFactory<
      FeatureViewModel,
      IFeatureCreateViewModelDto,
      FeatureAggregate,
      FeaturePrimitives
    >
{
  private readonly logger = new Logger(FeatureViewModelFactory.name);

  /**
   * Creates a new feature view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: IFeatureCreateViewModelDto): FeatureViewModel {
    this.logger.log(
      `Creating feature view model from DTO: ${JSON.stringify(data)}`,
    );
    return new FeatureViewModel(data);
  }

  /**
   * Creates a new feature view model from a feature primitive.
   *
   * @param featurePrimitives - The feature primitive to create the view model from.
   * @returns The feature view model.
   */
  fromPrimitives(featurePrimitives: FeaturePrimitives): FeatureViewModel {
    this.logger.log(
      `Creating feature view model from primitives: ${featurePrimitives}`,
    );

    return new FeatureViewModel({
      id: featurePrimitives.id,
      key: featurePrimitives.key,
      name: featurePrimitives.name,
      description: featurePrimitives.description,
      status: featurePrimitives.status,
      createdAt: featurePrimitives.createdAt,
      updatedAt: featurePrimitives.updatedAt,
    });
  }

  /**
   * Creates a new feature view model from a feature aggregate.
   *
   * @param featureAggregate - The feature aggregate to create the view model from.
   * @returns The feature view model.
   */
  fromAggregate(featureAggregate: FeatureAggregate): FeatureViewModel {
    this.logger.log(
      `Creating feature view model from aggregate: ${featureAggregate}`,
    );

    return new FeatureViewModel({
      id: featureAggregate.id.value,
      key: featureAggregate.key.value,
      name: featureAggregate.name.value,
      description: featureAggregate.description?.value || null,
      status: featureAggregate.status.value,
      createdAt: featureAggregate.createdAt.value,
      updatedAt: featureAggregate.updatedAt.value,
    });
  }
}
