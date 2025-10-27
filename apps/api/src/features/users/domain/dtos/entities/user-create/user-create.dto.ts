import { UserAvatarUrlValueObject } from '@/features/users/domain/value-objects/user-avatar-url/user-avatar-url.vo';
import { UserBioValueObject } from '@/features/users/domain/value-objects/user-bio/user-bio.vo';
import { UserLastNameValueObject } from '@/features/users/domain/value-objects/user-last-name/user-last-name.vo';
import { UserNameValueObject } from '@/features/users/domain/value-objects/user-name/user-name.vo';
import { UserRoleValueObject } from '@/features/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/features/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/features/users/domain/value-objects/user-user-name/user-user-name.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

/**
 * Interface representing the structure required to create a new user entity.
 *
 * @interface IUserCreateDto
 * @property {UserUuidValueObject} id - The unique identifier for the user.
 * @property {UserUserNameValueObject} userName - The user's user name.
 * @property {UserNameValueObject} [name] - The user's name. Optional.
 * @property {UserLastNameValueObject} [lastName] - The user's last name. Optional.
 * @property {UserBioValueObject} [bio] - The user's biography. Optional.
 * @property {UserAvatarValueObject} [avatar] - The user's avatar. Optional.
 * @property {UserRoleValueObject} [role] - The user's role. Optional.
 * @property {UserStatusValueObject} [status] - The user's status. Optional.
 */
export interface IUserCreateDto {
  id: UserUuidValueObject;
  avatarUrl?: UserAvatarUrlValueObject | null;
  bio?: UserBioValueObject | null;
  lastName?: UserLastNameValueObject | null;
  name?: UserNameValueObject | null;
  role?: UserRoleValueObject;
  status?: UserStatusValueObject;
  userName?: UserUserNameValueObject | null;
}
