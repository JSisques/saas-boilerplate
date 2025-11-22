import { AuthViewModelFactory } from '@/auth-context/auth/domain/factories/auth-view-model/auth-view-model.factory';
import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';
import { AuthMongoDbDto } from '@/auth-context/auth/infrastructure/database/mongodb/dtos/auth-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthMongoDBMapper {
  private readonly logger = new Logger(AuthMongoDBMapper.name);

  constructor(private readonly authViewModelFactory: AuthViewModelFactory) {}
  /**
   * Converts a MongoDB document to a auth view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The auth view model
   */
  toViewModel(doc: AuthMongoDbDto): AuthViewModel {
    this.logger.log(
      `Converting MongoDB document to auth view model with id ${doc.id}`,
    );

    return this.authViewModelFactory.create({
      id: doc.id,
      userId: doc.userId,
      email: doc.email,
      emailVerified: doc.emailVerified,
      phoneNumber: doc.phoneNumber || null,
      lastLoginAt: doc.lastLoginAt || null,
      password: doc.password || null,
      provider: doc.provider,
      providerId: doc.providerId || null,
      twoFactorEnabled: doc.twoFactorEnabled,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  /**
   * Converts a auth view model to a MongoDB document
   *
   * @param authViewModel - The auth view model to convert
   * @returns The MongoDB document
   */
  toMongoData(authViewModel: AuthViewModel): AuthMongoDbDto {
    this.logger.log(
      `Converting auth view model with id ${authViewModel.id} to MongoDB document`,
    );

    return {
      id: authViewModel.id,
      userId: authViewModel.userId,
      email: authViewModel.email,
      emailVerified: authViewModel.emailVerified,
      phoneNumber: authViewModel.phoneNumber || null,
      lastLoginAt: authViewModel.lastLoginAt,
      password: authViewModel.password,
      provider: authViewModel.provider,
      providerId: authViewModel.providerId,
      twoFactorEnabled: authViewModel.twoFactorEnabled,
      createdAt: authViewModel.createdAt,
      updatedAt: authViewModel.updatedAt,
    };
  }
}
