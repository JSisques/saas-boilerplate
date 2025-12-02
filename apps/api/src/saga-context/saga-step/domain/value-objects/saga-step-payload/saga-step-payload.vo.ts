import { JsonValueObject } from '@/shared/domain/value-objects/json/json.vo';

/**
 * SagaStepPayloadValueObject represents the payload of a saga step.
 * It extends the JsonValueObject to leverage common JSON functionalities.
 */
export class SagaStepPayloadValueObject extends JsonValueObject {
  constructor(value?: Record<string, any> | string) {
    super(value, {
      allowEmpty: true,
    });
  }
}
