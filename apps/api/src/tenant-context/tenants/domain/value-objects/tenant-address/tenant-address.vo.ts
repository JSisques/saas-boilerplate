import { StringValueObject } from '@/shared/domain/value-objects/string.vo';

/**
 * TenantAddressValueObject represents a tenant's address in the domain.
 * It extends the StringValueObject to leverage common string functionalities.
 */
export class TenantAddressValueObject extends StringValueObject {
  constructor(
    value: string,
    options: {
      minLength?: number;
      maxLength?: number;
      allowEmpty?: boolean;
    } = {},
  ) {
    super(value, {
      minLength: options.minLength ?? 5,
      maxLength: options.maxLength ?? 255,
      allowEmpty: options.allowEmpty ?? true,
      trim: true,
    });
  }
}
