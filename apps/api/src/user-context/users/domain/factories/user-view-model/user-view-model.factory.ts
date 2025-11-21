import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { IUserCreateViewModelDto } from '@/user-context/users/domain/dtos/view-models/user-create/user-create-view-model.dto';
import { UserPrimitives } from '@/user-context/users/domain/primitives/user.primitives';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';
import { Injectable, Logger } from '@nestjs/common';

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
    this.logger.log(
      `Creating user view model from DTO: ${JSON.stringify(data)}`,
    );
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

    return new UserViewModel({
      id: userPrimitives.id,
      userName: userPrimitives.userName,
      name: userPrimitives.name,
      lastName: userPrimitives.lastName,
      role: userPrimitives.role,
      status: userPrimitives.status,
      bio: userPrimitives.bio,
      avatarUrl: userPrimitives.avatarUrl,
      createdAt: userPrimitives.createdAt,
      updatedAt: userPrimitives.updatedAt,
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

    return new UserViewModel({
      id: userAggregate.id.value,
      userName: userAggregate.userName?.value,
      name: userAggregate.name?.value || null,
      lastName: userAggregate.lastName?.value || null,
      role: userAggregate.role?.value || null,
      status: userAggregate.status?.value || null,
      bio: userAggregate.bio?.value || null,
      avatarUrl: userAggregate.avatarUrl?.value || null,
      createdAt: userAggregate.createdAt.value,
      updatedAt: userAggregate.updatedAt.value,
    });
  }
}
