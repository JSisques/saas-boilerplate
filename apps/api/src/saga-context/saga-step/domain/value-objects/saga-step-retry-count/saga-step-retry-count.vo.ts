import { NumberValueObject } from '@/shared/domain/value-objects/number/number.vo';

/**
 * SagaStepRetryCountValueObject represents the retry count of a saga step.
 * It extends the NumberValueObject to leverage common number functionalities.
 */
export class SagaStepRetryCountValueObject extends NumberValueObject {
  constructor(value: number | string) {
    super(value, {
      min: 0,
      allowDecimals: false,
    });
  }
}
