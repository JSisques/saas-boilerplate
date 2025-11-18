import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';

/**
 * TenantStatusValueObject represents the status of a tenant.
 * It extends the EnumValueObject to leverage common enum functionalities.
 */
export class TenantStatusValueObject extends EnumValueObject<
  typeof TenantStatusEnum
> {
  protected get enumObject(): typeof TenantStatusEnum {
    return TenantStatusEnum;
  }
}
