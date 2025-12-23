import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { IFeatureCreateDto } from '@/feature-context/features/domain/dtos/entities/feature-create/feature-create.dto';
import { FeaturePrimitives } from '@/feature-context/features/domain/primitives/feature.primitives';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { Injectable } from '@nestjs/common';

/**
 * Factory class responsible for creating FeatureAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate feature information.
 */
@Injectable()
export class FeatureAggregateFactory
  implements IWriteFactory<FeatureAggregate, IFeatureCreateDto>
{
  /**
   * Creates a new FeatureAggregate entity using the provided properties.
   *
   * @param data - The feature create data.
   * @param generateEvent - Whether to generate a creation event (default: true).
   * @returns {FeatureAggregate} - The created feature aggregate entity.
   */
  public create(
    data: IFeatureCreateDto,
    generateEvent: boolean = true,
  ): FeatureAggregate {
    return new FeatureAggregate(data, generateEvent);
  }

  /**
   * Creates a new FeatureAggregate entity from primitive data.
   *
   * @param data - The feature primitive data.
   * @returns The created feature aggregate entity.
   */
  public fromPrimitives(data: FeaturePrimitives): FeatureAggregate {
    return new FeatureAggregate(
      {
        id: new FeatureUuidValueObject(data.id),
        key: new FeatureKeyValueObject(data.key),
        name: new FeatureNameValueObject(data.name),
        description: data.description
          ? new FeatureDescriptionValueObject(data.description)
          : null,
        status: new FeatureStatusValueObject(data.status),
        createdAt: new DateValueObject(data.createdAt),
        updatedAt: new DateValueObject(data.updatedAt),
      },
      false,
    );
  }
}
