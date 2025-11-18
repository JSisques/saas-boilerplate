import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

/**
 * TenantCountryValueObject represents a tenant's country in the domain.
 * It extends the StringValueObject to leverage common string functionalities.
 */
export class TenantCountryValueObject extends StringValueObject {
  constructor(
    value: string,
    options: {
      minLength?: number;
      maxLength?: number;
      allowEmpty?: boolean;
    } = {},
  ) {
    super(value, {
      minLength: options.minLength ?? 2,
      maxLength: options.maxLength ?? 100,
      allowEmpty: options.allowEmpty ?? true,
      trim: true,
    });
  }
}
