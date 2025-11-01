import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum.vo';

export class HealthStatusValueObject extends EnumValueObject<
  typeof HealthStatusEnum
> {
  protected get enumObject(): typeof HealthStatusEnum {
    return HealthStatusEnum;
  }
}
