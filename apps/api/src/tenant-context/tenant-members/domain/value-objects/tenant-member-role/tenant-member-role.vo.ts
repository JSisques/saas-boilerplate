import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';

/**
 * TenantMemberRoleValueObject represents the role of a tenant member.
 * It extends the EnumValueObject to leverage common enum functionalities.
 */
export class TenantMemberRoleValueObject extends EnumValueObject<
  typeof TenantMemberRoleEnum
> {
  protected get enumObject(): typeof TenantMemberRoleEnum {
    return TenantMemberRoleEnum;
  }
}
