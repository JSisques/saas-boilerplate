import { UserAggregate } from '@/features/users/domain/entities/user.aggregate';
import { UserPrimitives } from '@/features/users/domain/primitives/user.primitives';
import { UserAvatarValueObject } from '@/features/users/domain/value-objects/user-avatar/user-avatar.vo';
import { UserBioValueObject } from '@/features/users/domain/value-objects/user-bio/user-bio.vo';
import { UserNameValueObject } from '@/features/users/domain/value-objects/user-name/user-name.vo';
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
  implements IWriteFactory<UserAggregate, UserPrimitives>
{
  /**
   * Creates a new UserAggregate entity using the provided properties.
   *
   * @param props - The user primitive properties.
   * @param props.id - Unique identifier of the user.
   * @param props.name - Name of the user.
   * @param props.bio - Biography of the user (nullable).
   * @param props.avatar - Avatar URI of the user (nullable).
   * @param generateEvent - Flag to indicate if a creation event should be generated (default: true).
   * @returns {UserAggregate} - The created user aggregate entity.
   */
  create(props: UserPrimitives, generateEvent: boolean = true): UserAggregate {
    return new UserAggregate(
      {
        id: new UserUuidValueObject(),
        name: props.name ? new UserNameValueObject(props.name) : null,
        bio: props.bio ? new UserBioValueObject(props.bio) : null,
        avatar: props.avatar ? new UserAvatarValueObject(props.avatar) : null,
      },
      generateEvent,
    );
  }
}
