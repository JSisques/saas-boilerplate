import { JsonValueObject } from '@/shared/domain/value-objects/json/json.vo';

/**
 * SagaStepResultValueObject represents the result of a saga step.
 * It extends the JsonValueObject to leverage common JSON functionalities.
 */
export class SagaStepResultValueObject extends JsonValueObject {
  constructor(value?: Record<string, any> | string) {
    super(value, {
      allowEmpty: true,
    });
  }
}
