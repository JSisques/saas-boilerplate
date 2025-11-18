import { NumberValueObject } from '@/shared/domain/value-objects/number/number.vo';

/**
 * TenantMaxUsersValueObject represents a tenant's maximum users limit in the domain.
 * It extends the NumberValueObject to leverage common number functionalities.
 */
export class TenantMaxUsersValueObject extends NumberValueObject {
  constructor(
    value: number,
    options: {
      min?: number;
      max?: number;
      allowEmpty?: boolean;
    } = {},
  ) {
    super(value, {
      min: options.min ?? 1,
      max: options.max ?? 1000000,
      allowDecimals: false,
      precision: 0,
    });
  }
}
