import { NumberValueObject } from '@/shared/domain/value-objects/number.vo';

/**
 * TenantMaxStorageValueObject represents a tenant's maximum storage limit in the domain.
 * It extends the NumberValueObject to leverage common number functionalities.
 */
export class TenantMaxStorageValueObject extends NumberValueObject {
  constructor(
    value: number,
    options: {
      min?: number;
      max?: number;
      allowEmpty?: boolean;
    } = {},
  ) {
    super(value, {
      min: options.min ?? 0,
      max: options.max ?? 1000000000, // 1TB in MB
      allowDecimals: false,
      precision: 0,
    });
  }
}
