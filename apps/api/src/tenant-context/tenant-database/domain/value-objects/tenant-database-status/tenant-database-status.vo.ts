import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';

/**
 * TenantDatabaseStatusValueObject represents the status of a tenant database.
 * It extends the EnumValueObject to leverage common enum functionalities.
 */
export class TenantDatabaseStatusValueObject extends EnumValueObject<
  typeof TenantDatabaseStatusEnum
> {
  protected get enumObject(): typeof TenantDatabaseStatusEnum {
    return TenantDatabaseStatusEnum;
  }
}
