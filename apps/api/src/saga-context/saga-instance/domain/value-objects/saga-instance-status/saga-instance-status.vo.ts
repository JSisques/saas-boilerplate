import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

/**
 * SagaInstanceStatusValueObject represents the status of a saga instance.
 * It extends the EnumValueObject to leverage common enum functionalities.
 */
export class SagaInstanceStatusValueObject extends EnumValueObject<
  typeof SagaInstanceStatusEnum
> {
  protected get enumObject(): typeof SagaInstanceStatusEnum {
    return SagaInstanceStatusEnum;
  }
}
