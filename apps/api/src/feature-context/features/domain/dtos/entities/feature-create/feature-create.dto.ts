import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { IBaseAggregateDto } from '@/shared/domain/interfaces/base-aggregate-dto.interface';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';

/**
 * Interface representing the structure required to create a new feature entity.
 *
 * @interface IFeatureCreateDto
 * @property {FeatureUuidValueObject} id - The unique identifier for the feature.
 * @property {FeatureKeyValueObject} key - The unique key of the feature (e.g., "advanced-analytics").
 * @property {FeatureNameValueObject} name - The name of the feature.
 * @property {FeatureDescriptionValueObject | null} description - The description of the feature. Optional.
 * @property {FeatureStatusValueObject} status - The status of the feature.
 * @property {DateValueObject} createdAt - The created at date value object.
 * @property {DateValueObject} updatedAt - The updated at date value object.
 */
export interface IFeatureCreateDto extends IBaseAggregateDto {
  id: FeatureUuidValueObject;
  key: FeatureKeyValueObject;
  name: FeatureNameValueObject;
  description: FeatureDescriptionValueObject | null;
  status: FeatureStatusValueObject;
}
