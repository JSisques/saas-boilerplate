import { IUserCreateCommandDto } from '@/features/users/application/dtos/commands/user-create/user-create-command.dto';
import { UserAvatarUrlValueObject } from '@/features/users/domain/value-objects/user-avatar-url/user-avatar-url.vo';
import { UserBioValueObject } from '@/features/users/domain/value-objects/user-bio/user-bio.vo';
import { UserLastNameValueObject } from '@/features/users/domain/value-objects/user-last-name/user-last-name.vo';
import { UserNameValueObject } from '@/features/users/domain/value-objects/user-name/user-name.vo';
import { UserRoleValueObject } from '@/features/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/features/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/features/users/domain/value-objects/user-user-name/user-user-name.vo';
import { UserUuidValueObject } from '@/features/users/domain/value-objects/user-uuid/user-uuid.vo';

export class UserCreateCommand {
  readonly id: UserUuidValueObject;
  readonly avatarUrl: UserAvatarUrlValueObject | null;
  readonly bio: UserBioValueObject | null;
  readonly lastName: UserLastNameValueObject | null;
  readonly name: UserNameValueObject | null;
  readonly role: UserRoleValueObject;
  readonly status: UserStatusValueObject;
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

    this.role = new UserRoleValueObject(props.role);

    this.status = new UserStatusValueObject(props.status);

    this.userName = props.userName
      ? new UserUserNameValueObject(props.userName)
      : null;
  }
}
