import { IUserCreateDto } from '@/features/users/domain/dtos/entities/user-create/user-create.dto';
import { IUserUpdateDto } from '@/features/users/domain/dtos/entities/user-update/user-update.dto';
import { UserPrimitives } from '@/features/users/domain/primitives/user.primitives';
import { UserAvatarValueObject } from '@/features/users/domain/value-objects/user-avatar/user-avatar.vo';
import { UserBioValueObject } from '@/features/users/domain/value-objects/user-bio/user-bio.vo';
import { UserNameValueObject } from '@/features/users/domain/value-objects/user-name/user-name.vo';
import { UserUuidValueObject } from '@/features/users/domain/value-objects/user-uuid/user-uuid.vo';
import { UserCreatedEvent } from '@/shared/domain/events/users/user-created/user-created.event';
import { UserDeletedEvent } from '@/shared/domain/events/users/user-deleted/user-deleted.event';
import { UserUpdatedEvent } from "@/shared/domain/events/users/user-updated-import { UserIntegrationEventData } from '@/shared/application/integration-events/users/interfaces/user-updated/user-updated.event";
import { AggregateRoot } from '@nestjs/cqrs';

export class UserAggregate extends AggregateRoot {
  private readonly _id: UserUuidValueObject;
  private _name: UserNameValueObject | null;
  private _bio: UserBioValueObject | null;
  private _avatar: UserAvatarValueObject | null;

  constructor(props: IUserCreateDto, generateEvent: boolean = true) {
    super();

    // 01: Set the properties
    this._id = props.id;
    this._name = props.name;
    this._bio = props.bio;
    this._avatar = props.avatar;

    // 02: Apply the creation event
    if (generateEvent) {
      this.apply(
        new UserCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: UserAggregate.name,
            eventType: UserCreatedEvent.name,
          },
          {
            id: this._id.value,
            name: this._name?.value ?? null,
            bio: this._bio?.value ?? null,
            avatar: this._avatar?.value ?? null,
          },
        ),
      );
    }
  }

  /**
   * Update the user.
   *
   * @param props - The properties to update the user.
   * @param props.name - The name of the user.
   * @param props.bio - The bio of the user.
   * @param props.avatar - The avatar of the user.
   */
  public update(props: IUserUpdateDto, generateEvent: boolean = true) {
    // 01: Update the properties
    this._name = props.name;
    this._bio = props.bio;
    this._avatar = props.avatar;

    if (generateEvent) {
      this.apply(
        new UserUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: UserAggregate.name,
            eventType: UserUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the user.
   *
   * @param generateEvent - Whether to generate the user deleted event. Default is true.
   */
  public delete(generateEvent: boolean = true) {
    if (generateEvent) {
      this.apply(
        new UserDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: UserAggregate.name,
            eventType: UserDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Get the id of the user.
   *
   * @returns The id of the user.
   */
  public get id(): UserUuidValueObject {
    return this._id;
  }

  /**
   * Get the name of the user.
   *
   * @returns The name of the user.
   */
  public get name(): UserNameValueObject | null {
    return this._name;
  }

  /**
   * Get the bio of the user.
   *
   * @returns The bio of the user.
   */
  public get bio(): UserBioValueObject | null {
    return this._bio;
  }

  /**
   * Get the avatar of the user.
   *
   * @returns The avatar of the user.
   */
  public get avatar(): UserAvatarValueObject | null {
    return this._avatar;
  }

  public toPrimitives(): UserPrimitives {
    return {
      id: this._id.value,
      name: this._name?.value ?? null,
      bio: this._bio?.value ?? null,
      avatar: this._avatar?.value ?? null,
    };
  }
}
