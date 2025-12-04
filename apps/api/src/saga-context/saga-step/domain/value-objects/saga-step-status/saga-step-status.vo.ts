import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

/**
 * SagaStepStatusValueObject represents the status of a saga step.
 * It extends the EnumValueObject to leverage common enum functionalities.
 */
export class SagaStepStatusValueObject extends EnumValueObject<
  typeof SagaStepStatusEnum
> {
  protected get enumObject(): typeof SagaStepStatusEnum {
    return SagaStepStatusEnum;
  }
}
