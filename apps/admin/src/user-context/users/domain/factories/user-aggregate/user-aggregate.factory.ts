import { IWriteFactory } from "@/shared/domain/interfaces/write-factory.interface";
import { UserUuidValueObject } from "@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo";
import { UserAggregate } from "@/user-context/users/domain/aggregates/user.aggregate";
import { IUserCreateDto } from "@/user-context/users/domain/dtos/entities/user-create/user-create.dto";
import { UserPrimitives } from "@/user-context/users/domain/primitives/user.primitives";
import { UserAvatarUrlValueObject } from "@/user-context/users/domain/value-objects/user-avatar-url/user-avatar-url.vo";
import { UserBioValueObject } from "@/user-context/users/domain/value-objects/user-bio/user-bio.vo";
import { UserLastNameValueObject } from "@/user-context/users/domain/value-objects/user-last-name/user-last-name.vo";
import { UserNameValueObject } from "@/user-context/users/domain/value-objects/user-name/user-name.vo";
import { UserRoleValueObject } from "@/user-context/users/domain/value-objects/user-role/user-role.vo";
import { UserStatusValueObject } from "@/user-context/users/domain/value-objects/user-status/user-status.vo";
import { UserUserNameValueObject } from "@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo";

/**
 * Factory class responsible for creating UserAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate user information.
 */
export class UserAggregateFactory
  implements IWriteFactory<UserAggregate, IUserCreateDto>
{
  /**
   * Creates a new UserAggregate entity using the provided properties.
   *
   * @param data - The user create data.
   * @returns {UserAggregate} - The created user aggregate entity.
   */
  public create(data: IUserCreateDto): UserAggregate {
    return new UserAggregate(data);
  }

  /**
   * Creates a new UserAggregate entity from primitive data.
   *
   * @param data - The user primitive data.
   * @returns The created user aggregate entity.
   */
  public fromPrimitives(data: UserPrimitives): UserAggregate {
    return new UserAggregate({
      id: new UserUuidValueObject(data.id),
      name: data.name ? new UserNameValueObject(data.name) : null,
      bio: data.bio ? new UserBioValueObject(data.bio) : null,
      avatarUrl: data.avatarUrl
        ? new UserAvatarUrlValueObject(data.avatarUrl)
        : null,
      lastName: data.lastName
        ? new UserLastNameValueObject(data.lastName)
        : null,
      role: new UserRoleValueObject(data.role),
      status: new UserStatusValueObject(data.status),
      userName: data.userName
        ? new UserUserNameValueObject(data.userName)
        : null,
    });
  }
}
