import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { IAuthCreateViewModelDto } from '@/auth-context/auth/domain/dtos/view-models/auth-create/auth-create-view-model.dto';
import { AuthPrimitives } from '@/auth-context/auth/domain/primitives/auth.primitives';
import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable, Logger } from '@nestjs/common';

/**
 * This factory class is used to create a new auth entity.
 */
@Injectable()
export class AuthViewModelFactory
  implements
    IReadFactory<
      AuthViewModel,
      IAuthCreateViewModelDto,
      AuthAggregate,
      AuthPrimitives
    >
{
  private readonly logger = new Logger(AuthViewModelFactory.name);

  /**
   * Creates a new auth view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: IAuthCreateViewModelDto): AuthViewModel {
    this.logger.log(`Creating auth view model from DTO: ${data}`);

    return new AuthViewModel(data);
  }
  /**
   * Creates a new auth view model from a auth primitives.
   *
   * @param authPrimitives - The auth primitive to create the view model from.
   * @returns The auth view model.
   */
  public fromPrimitives(authPrimitives: AuthPrimitives): AuthViewModel {
    this.logger.log(
      `Creating auth view model from primitives: ${authPrimitives}`,
    );

    const now = new Date();

    return new AuthViewModel({
      id: authPrimitives.id,
      userId: authPrimitives.userId,
      email: authPrimitives.email,
      emailVerified: authPrimitives.emailVerified,
      phoneNumber: authPrimitives.phoneNumber,
      lastLoginAt: authPrimitives.lastLoginAt,
      password: authPrimitives.password,
      provider: authPrimitives.provider,
      providerId: authPrimitives.providerId,
      twoFactorEnabled: authPrimitives.twoFactorEnabled,
      createdAt: now,
      updatedAt: now,
    });
  }
  /**
   * Creates a new auth view model from a auth aggregate.
   *
   * @param authAggregate - The auth aggregate to create the view model from.
   * @returns The auth view model.
   */
  public fromAggregate(authAggregate: AuthAggregate): AuthViewModel {
    this.logger.log(
      `Creating auth view model from aggregate: ${authAggregate}`,
    );

    const now = new Date();

    return new AuthViewModel({
      id: authAggregate.id.value,
      userId: authAggregate.userId.value,
      email: authAggregate.email?.value,
      emailVerified: authAggregate.emailVerified.value,
      phoneNumber: authAggregate.phoneNumber?.value,
      lastLoginAt: authAggregate.lastLoginAt?.value,
      password: authAggregate.password?.value,
      provider: authAggregate.provider.value,
      providerId: authAggregate.providerId?.value,
      twoFactorEnabled: authAggregate.twoFactorEnabled.value,
      createdAt: now,
      updatedAt: now,
    });
  }
}
