import { UserRoleEnum } from '@/features/users/domain/enums/user-role/user-role.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum.vo';

export class UserRoleValueObject extends EnumValueObject<typeof UserRoleEnum> {
  protected get enumObject(): typeof UserRoleEnum {
    return UserRoleEnum;
  }
}
