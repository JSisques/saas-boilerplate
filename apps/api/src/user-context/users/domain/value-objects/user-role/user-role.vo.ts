import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

export class UserRoleValueObject extends EnumValueObject<typeof UserRoleEnum> {
  protected get enumObject(): typeof UserRoleEnum {
    return UserRoleEnum;
  }
}
