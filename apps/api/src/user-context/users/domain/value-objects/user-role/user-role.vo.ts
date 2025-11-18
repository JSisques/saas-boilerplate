import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';

export class UserRoleValueObject extends EnumValueObject<typeof UserRoleEnum> {
  protected get enumObject(): typeof UserRoleEnum {
    return UserRoleEnum;
  }
}
