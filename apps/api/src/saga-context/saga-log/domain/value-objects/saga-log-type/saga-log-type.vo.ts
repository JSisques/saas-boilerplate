import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

/**
 * SagaLogTypeValueObject represents the type of a saga log.
 * It extends the EnumValueObject to leverage common enum functionalities.
 */
export class SagaLogTypeValueObject extends EnumValueObject<
  typeof SagaLogTypeEnum
> {
  protected get enumObject(): typeof SagaLogTypeEnum {
    return SagaLogTypeEnum;
  }
}
