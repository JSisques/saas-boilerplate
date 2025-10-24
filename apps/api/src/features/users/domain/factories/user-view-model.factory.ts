import { UserAggregate } from '@/features/users/domain/entities/user.aggregate';
import { UserPrimitives } from '@/features/users/domain/primitives/user.primitives';
import { UserViewModel } from '@/features/users/domain/view-models/user.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable } from '@nestjs/common';

export const USER_VIEW_MODEL_FACTORY_TOKEN = Symbol('UserViewModelFactory');

/**
 * This factory class is used to create a new user entity.
 */
@Injectable()
export class UserViewModelFactory implements IReadFactory<UserViewModel> {
  /**
   * Creates a new user view model from a user aggregate.
   *
   * @param userPrimitives - The user primitive to create the view model from.
   * @returns The user view model.
   */
  fromPrimitives(userPrimitives: UserPrimitives): UserViewModel {
    const now = new Date();

    return new UserViewModel({
      id: userPrimitives.id,
      name: userPrimitives.name,
      bio: userPrimitives.bio,
      avatar: userPrimitives.avatar,
      createdAt: now,
      updatedAt: now,
    });
  }
  /**
   * Creates a new user view model from a user aggregate.
   *
   * @param userAggregate - The user aggregate to create the view model from.
   * @returns The user view model.
   */
  fromAggregate(userAggregate: UserAggregate): UserViewModel {
    const now = new Date();

    return new UserViewModel({
      id: userAggregate.id.value,
      name: userAggregate.name?.value || null,
      bio: userAggregate.bio?.value || null,
      avatar: userAggregate.avatar?.value || null,
      createdAt: now,
      updatedAt: now,
    });
  }
}
