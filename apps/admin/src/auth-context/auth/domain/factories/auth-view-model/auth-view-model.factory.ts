import { AuthAggregate } from '@/auth-context/auth/domain/aggregates/auth.aggregate';
import { IAuthCreateViewModelDto } from '@/auth-context/auth/domain/dtos/view-models/auth-create/auth-create-view-model.dto';
import { AuthPrimitives } from '@/auth-context/auth/domain/primitives/auth.primitives';
import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';
import { IReadFactory } from '@repo/shared/domain/interfaces/read-factory.interface';

/**
 * This factory class is used to create a new auth view model.
 */
export class AuthViewModelFactory
  implements
    IReadFactory<
      AuthViewModel,
      IAuthCreateViewModelDto,
      AuthAggregate,
      AuthPrimitives
    >
{
  /**
   * Creates a new auth view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: IAuthCreateViewModelDto): AuthViewModel {
    return new AuthViewModel(data);
  }

  /**
   * Creates a new auth view model from a auth primitive.
   *
   * @param authPrimitives - The auth primitive to create the view model from.
   * @returns The subscription plan view model.
   */
  fromPrimitives(authPrimitives: AuthPrimitives): AuthViewModel {
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
   * Creates a new subscription plan view model from a subscription plan aggregate.
   *
   * @param authAggregate - The auth aggregate to create the view model from.
   * @returns The subscription plan view model.
   */
  fromAggregate(authAggregate: AuthAggregate): AuthViewModel {
    const now = new Date();

    return new AuthViewModel({
      id: authAggregate.id.value,
      userId: authAggregate.userId.value,
      email: authAggregate.email?.value ?? null,
      emailVerified: authAggregate.emailVerified.value,
      phoneNumber: authAggregate.phoneNumber?.value ?? null,
      lastLoginAt: authAggregate.lastLoginAt?.value ?? null,
      password: authAggregate.password?.value ?? null,
      provider: authAggregate.provider.value,
      providerId: authAggregate.providerId?.value ?? null,
      twoFactorEnabled: authAggregate.twoFactorEnabled.value,
      createdAt: now,
      updatedAt: now,
    });
  }
}
