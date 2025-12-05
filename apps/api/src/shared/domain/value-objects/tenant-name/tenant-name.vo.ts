import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

/**
 * TenantNameValueObject represents a tenant's name in the domain.
 * It extends the StringValueObject to leverage common string functionalities.
 * This value object is shared across modules to avoid cross-module dependencies.
 */
export class TenantNameValueObject extends StringValueObject {}
