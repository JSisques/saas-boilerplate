import { UserAggregate } from '@/features/users/domain/aggregates/user.aggregate';
import { IUserCreateViewModelDto } from '@/features/users/domain/dtos/view-models/user-create/user-create-view-model.dto';
import { UserPrimitives } from '@/features/users/domain/primitives/user.primitives';
import { UserViewModel } from '@/features/users/domain/view-models/user.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable, Logger } from '@nestjs/common';

export const USER_VIEW_MODEL_FACTORY_TOKEN = Symbol('UserViewModelFactory');

/**
 * This factory class is used to create a new user entity.
 */
@Injectable()
export class UserViewModelFactory
  implements
    IReadFactory<
      UserViewModel,
      IUserCreateViewModelDto,
      UserAggregate,
      UserPrimitives
    >
{
  private readonly logger = new Logger(UserViewModelFactory.name);

  /**
   * Creates a new user view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: IUserCreateViewModelDto): UserViewModel {
    this.logger.log(`Creating user view model from DTO: ${data}`);
    return new UserViewModel(data);
  }

  /**
   * Creates a new user view model from a user primitive.
   *
   * @param userPrimitives - The user primitive to create the view model from.
   * @returns The user view model.
   */
  fromPrimitives(userPrimitives: UserPrimitives): UserViewModel {
    this.logger.log(
      `Creating user view model from primitives: ${userPrimitives}`,
    );

    const now = new Date();

    return new UserViewModel({
      id: userPrimitives.id,
      userName: userPrimitives.userName,
      name: userPrimitives.name,
      lastName: userPrimitives.lastName,
      role: userPrimitives.role,
      status: userPrimitives.status,
      bio: userPrimitives.bio,
      avatarUrl: userPrimitives.avatarUrl,
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
    this.logger.log(
      `Creating user view model from aggregate: ${userAggregate}`,
    );

    const now = new Date();

    return new UserViewModel({
      id: userAggregate.id.value,
      userName: userAggregate.userName?.value,
      name: userAggregate.name?.value || null,
      lastName: userAggregate.lastName?.value || null,
      role: userAggregate.role?.value || null,
      status: userAggregate.status?.value || null,
      bio: userAggregate.bio?.value || null,
      avatarUrl: userAggregate.avatarUrl?.value || null,
      createdAt: now,
      updatedAt: now,
    });
  }
}
