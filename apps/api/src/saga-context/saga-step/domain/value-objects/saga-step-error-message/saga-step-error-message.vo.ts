import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

/**
 * SagaStepErrorMessageValueObject represents the error message of a saga step.
 * It extends the StringValueObject to leverage common string functionalities.
 */
export class SagaStepErrorMessageValueObject extends StringValueObject {
  constructor(value: string) {
    super(value, {
      allowEmpty: true,
    });
  }
}
