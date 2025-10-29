import { StringValueObject } from '@/shared/domain/value-objects/string.vo';

/**
 * TenantPostalCodeValueObject represents a tenant's postal code in the domain.
 * It extends the StringValueObject to leverage common string functionalities.
 */
export class TenantPostalCodeValueObject extends StringValueObject {
  constructor(
    value: string,
    options: {
      minLength?: number;
      maxLength?: number;
      allowEmpty?: boolean;
    } = {},
  ) {
    super(value, {
      minLength: options.minLength ?? 3,
      maxLength: options.maxLength ?? 20,
      allowEmpty: options.allowEmpty ?? true,
      trim: true,
    });
  }
}
