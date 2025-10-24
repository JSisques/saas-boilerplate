import { UserViewModel } from '@/features/users/domain/view-models/user.view-model';
import { UserMongoDbDto } from '@/features/users/infrastructure/database/mongodb/dtos/user-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

export const USER_MONGODB_MAPPER_TOKEN = Symbol('UserMongoDBMapper');

@Injectable()
export class UserMongoDBMapper {
  private readonly logger = new Logger(UserMongoDBMapper.name);
  /**
   * Converts a MongoDB document to a user view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The user view model
   */
  toViewModel(doc: UserMongoDbDto): UserViewModel {
    this.logger.log(
      `Converting MongoDB document to user view model with id ${doc.id}`,
    );

    return new UserViewModel({
      id: doc.id,
      userName: doc.userName,
      name: doc.name,
      lastName: doc.lastName,
      role: doc.role,
      status: doc.status,
      bio: doc.bio,
      avatarUrl: doc.avatarUrl,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  /**
   * Converts a user view model to a MongoDB document
   *
   * @param userViewModel - The user view model to convert
   * @returns The MongoDB document
   */
  toMongoData(userViewModel: UserViewModel): UserMongoDbDto {
    this.logger.log(
      `Converting user view model with id ${userViewModel.id} to MongoDB document`,
    );

    return {
      id: userViewModel.id,
      avatarUrl: userViewModel.avatarUrl,
      bio: userViewModel.bio,
      name: userViewModel.name,
      lastName: userViewModel.lastName,
      role: userViewModel.role,
      status: userViewModel.status,
      userName: userViewModel.userName,
      createdAt: userViewModel.createdAt,
      updatedAt: userViewModel.updatedAt,
    };
  }
}
