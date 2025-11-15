import { UserRoleEnum } from "@/user-context/users/domain/enums/user-role/user-role.enum";
import { EnumValueObject } from "@repo/shared/domain/value-objects/enum.vo";

export class UserRoleValueObject extends EnumValueObject<typeof UserRoleEnum> {
  protected get enumObject(): typeof UserRoleEnum {
    return UserRoleEnum;
  }
}
