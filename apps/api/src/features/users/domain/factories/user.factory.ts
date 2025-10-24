import { UserAggregate } from '@/features/users/domain/aggregates/user.aggregate';
import { IUserCreateDto } from '@/features/users/domain/dtos/entities/user-create/user-create.dto';
import { UserPrimitives } from '@/features/users/domain/primitives/user.primitives';
import { UserAvatarUrlValueObject } from '@/features/users/domain/value-objects/user-avatar-url/user-avatar-url.vo';
import { UserBioValueObject } from '@/features/users/domain/value-objects/user-bio/user-bio.vo';
import { UserLastNameValueObject } from '@/features/users/domain/value-objects/user-last-name/user-last-name.vo';
import { UserNameValueObject } from '@/features/users/domain/value-objects/user-name/user-name.vo';
import { UserRoleValueObject } from '@/features/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/features/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/features/users/domain/value-objects/user-user-name/user-user-name.vo';
import { UserUuidValueObject } from '@/features/users/domain/value-objects/user-uuid/user-uuid.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { Injectable } from '@nestjs/common';

/**
 * Factory token for user aggregate creation.
 */
export const USER_AGGREGATE_FACTORY_TOKEN = Symbol('UserAggregateFactory');

/**
 * Factory class responsible for creating UserAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate user information.
 */
@Injectable()
export class UserAggregateFactory
  implements IWriteFactory<UserAggregate, IUserCreateDto>
{
  /**
   * Creates a new UserAggregate entity using the provided properties.
   *
   * @param data - The user create data.
   * @param data.id - The user id.
   * @param data.name - The user name.
   * @param data.bio - The user bio.
   * @param data.avatarUrl - The user avatar url.
   * @param data.lastName - The user last name.
   * @param data.role - The user role.
   * @param data.status - The user status.
   * @param data.userName - The user user name.
   * @param generateEvent - Whether to generate a creation event (default: true).
   * @returns {UserAggregate} - The created user aggregate entity.
   */
  public create(
    data: IUserCreateDto,
    generateEvent: boolean = true,
  ): UserAggregate {
    return new UserAggregate(data, generateEvent);
  }

  /**
   * Creates a new UserAggregate entity from primitive data.
   *
   * @param data - The user primitive data.
   * @param data.id - The user id.
   * @param data.name - The user name.
   * @param data.bio - The user bio.
   * @param data.avatarUrl - The user avatar url.
   * @param data.lastName - The user last name.
   * @param data.role - The user role.
   * @param data.status - The user status.
   * @param data.userName - The user user name.
   * @returns The created user aggregate entity.
   */
  public fromPrimitives(data: UserPrimitives): UserAggregate {
    return new UserAggregate({
      id: new UserUuidValueObject(data.id),
      name: new UserNameValueObject(data.name),
      bio: new UserBioValueObject(data.bio),
      avatarUrl: new UserAvatarUrlValueObject(data.avatarUrl),
      lastName: new UserLastNameValueObject(data.lastName),
      role: new UserRoleValueObject(data.role),
      status: new UserStatusValueObject(data.status),
      userName: new UserUserNameValueObject(data.userName),
    });
  }
}
