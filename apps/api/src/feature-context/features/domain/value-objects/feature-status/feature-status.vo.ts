import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

/**
 * FeatureStatusValueObject represents the status of a feature.
 * It extends the EnumValueObject to leverage common enum functionalities.
 */
export class FeatureStatusValueObject extends EnumValueObject<
  typeof FeatureStatusEnum
> {
  protected get enumObject(): typeof FeatureStatusEnum {
    return FeatureStatusEnum;
  }
}
