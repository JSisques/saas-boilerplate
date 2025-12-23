import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

/**
 * UserStatusValueObject represents the status of a user.
 * It extends the EnumValueObject to leverage common enum functionalities.
 */
export class UserStatusValueObject extends EnumValueObject<
  typeof UserStatusEnum
> {
  protected get enumObject(): typeof UserStatusEnum {
    return UserStatusEnum;
  }
}
