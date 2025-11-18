import { NumberValueObject } from '@/shared/domain/value-objects/number/number.vo';

/**
 * PromptVersionValueObject represents a prompt's version number in the domain.
 * It extends the NumberValueObject with validation for version numbers (must be >= 1).
 */
export class PromptVersionValueObject extends NumberValueObject {
  constructor(value: number | string) {
    super(value, {
      min: 1,
      allowDecimals: false,
    });
  }
}
