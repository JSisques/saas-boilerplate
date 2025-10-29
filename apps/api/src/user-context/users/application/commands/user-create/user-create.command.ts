import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { IUserCreateCommandDto } from '@/user-context/users/application/dtos/commands/user-create/user-create-command.dto';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserAvatarUrlValueObject } from '@/user-context/users/domain/value-objects/user-avatar-url/user-avatar-url.vo';
import { UserBioValueObject } from '@/user-context/users/domain/value-objects/user-bio/user-bio.vo';
import { UserLastNameValueObject } from '@/user-context/users/domain/value-objects/user-last-name/user-last-name.vo';
import { UserNameValueObject } from '@/user-context/users/domain/value-objects/user-name/user-name.vo';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';

export class UserCreateCommand {
  readonly id: UserUuidValueObject;
  readonly avatarUrl: UserAvatarUrlValueObject | null;
  readonly bio: UserBioValueObject | null;
  readonly lastName: UserLastNameValueObject | null;
  readonly name: UserNameValueObject | null;
  readonly role?: UserRoleValueObject;
  readonly status?: UserStatusValueObject;
  readonly userName: UserUserNameValueObject | null;

  constructor(props: IUserCreateCommandDto) {
    this.id = new UserUuidValueObject();

    this.avatarUrl = props.avatarUrl
      ? new UserAvatarUrlValueObject(props.avatarUrl)
      : null;

    this.bio = props.bio ? new UserBioValueObject(props.bio) : null;

    this.lastName = props.lastName
      ? new UserLastNameValueObject(props.lastName)
      : null;

    this.name = props.name ? new UserNameValueObject(props.name) : null;

    this.role = new UserRoleValueObject(
      props.role !== undefined ? props.role : UserRoleEnum.USER,
    );

    this.status = new UserStatusValueObject(
      props.status !== undefined ? props.status : UserStatusEnum.ACTIVE,
    );

    this.userName = props.userName
      ? new UserUserNameValueObject(props.userName)
      : null;
  }
}
