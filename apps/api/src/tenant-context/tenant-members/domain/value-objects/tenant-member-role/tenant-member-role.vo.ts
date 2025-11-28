import { TenantMemberRoleEnum } from '@/prisma/master/client';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

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
