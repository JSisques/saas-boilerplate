import { NumberValueObject } from '@/shared/domain/value-objects/number/number.vo';

/**
 * SagaStepMaxRetriesValueObject represents the maximum retries of a saga step.
 * It extends the NumberValueObject to leverage common number functionalities.
 */
export class SagaStepMaxRetriesValueObject extends NumberValueObject {
  constructor(value: number | string) {
    super(value, {
      min: 0,
      allowDecimals: false,
    });
  }
}
