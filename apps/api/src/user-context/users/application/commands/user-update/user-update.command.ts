import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { IUserUpdateCommandDto } from '@/user-context/users/application/dtos/commands/user-update/user-update-command.dto';
import { UserAvatarUrlValueObject } from '@/user-context/users/domain/value-objects/user-avatar-url/user-avatar-url.vo';
import { UserBioValueObject } from '@/user-context/users/domain/value-objects/user-bio/user-bio.vo';
import { UserLastNameValueObject } from '@/user-context/users/domain/value-objects/user-last-name/user-last-name.vo';
import { UserNameValueObject } from '@/user-context/users/domain/value-objects/user-name/user-name.vo';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';

export class UserUpdateCommand {
  readonly id: UserUuidValueObject;
  readonly avatarUrl?: UserAvatarUrlValueObject | null;
  readonly bio?: UserBioValueObject | null;
  readonly lastName?: UserLastNameValueObject | null;
  readonly name?: UserNameValueObject | null;
  readonly role?: UserRoleValueObject;
  readonly status?: UserStatusValueObject;
  readonly userName?: UserUserNameValueObject;

  constructor(props: IUserUpdateCommandDto) {
    this.id = new UserUuidValueObject(props.id);

    if (props.avatarUrl !== undefined) {
      this.avatarUrl = props.avatarUrl
        ? new UserAvatarUrlValueObject(props.avatarUrl)
        : null;
    }

    if (props.bio !== undefined) {
      this.bio = props.bio ? new UserBioValueObject(props.bio) : null;
    }

    if (props.lastName !== undefined) {
      this.lastName = props.lastName
        ? new UserLastNameValueObject(props.lastName)
        : null;
    }

    if (props.name !== undefined) {
      this.name = props.name ? new UserNameValueObject(props.name) : null;
    }

    if (props.role !== undefined) {
      this.role = new UserRoleValueObject(props.role);
    }

    if (props.status !== undefined) {
      this.status = new UserStatusValueObject(props.status);
    }

    if (props.userName !== undefined) {
      this.userName = props.userName
        ? new UserUserNameValueObject(props.userName)
        : null;
    }
  }
}
