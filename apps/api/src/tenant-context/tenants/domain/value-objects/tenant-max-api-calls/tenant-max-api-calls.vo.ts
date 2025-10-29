import { NumberValueObject } from '@/shared/domain/value-objects/number.vo';

/**
 * TenantMaxApiCallsValueObject represents a tenant's maximum API calls limit in the domain.
 * It extends the NumberValueObject to leverage common number functionalities.
 */
export class TenantMaxApiCallsValueObject extends NumberValueObject {
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
      max: options.max ?? 100000000, // 100M API calls
      allowDecimals: false,
      precision: 0,
    });
  }
}
