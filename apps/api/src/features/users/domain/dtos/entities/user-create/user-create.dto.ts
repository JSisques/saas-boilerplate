import { UserAvatarValueObject } from '@/features/users/domain/value-objects/user-avatar/user-avatar.vo';
import { UserBioValueObject } from '@/features/users/domain/value-objects/user-bio/user-bio.vo';
import { UserNameValueObject } from '@/features/users/domain/value-objects/user-name/user-name.vo';
import { UserUuidValueObject } from '@/features/users/domain/value-objects/user-uuid/user-uuid.vo';

/**
 * Interface representing the structure required to create a new user entity.
 *
 * @interface IUserCreateDto
 * @property {UserUuidValueObject} id - The unique identifier for the user.
 * @property {UserNameValueObject} [name] - The user's name. Optional.
 * @property {UserBioValueObject} [bio] - The user's biography. Optional.
 * @property {UserAvatarValueObject} [avatar] - The user's avatar. Optional.
 */
export interface IUserCreateDto {
  id: UserUuidValueObject;
  name?: UserNameValueObject;
  bio?: UserBioValueObject;
  avatar?: UserAvatarValueObject;
}
