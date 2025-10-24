import { UserUsernameIsNotUniqueException } from '@/features/users/application/exceptions/user-username-is-not-unique/user-username-is-not-unique.exception';
import {
  USER_WRITE_REPOSITORY_TOKEN,
  UserWriteRepository,
} from '@/features/users/domain/repositories/user-write.repository';
import { IBaseService } from '@/shared/application/services/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertUserUsernameIsUniqueService
  implements IBaseService<string, void>
{
  private readonly logger = new Logger(AssertUserUsernameIsUniqueService.name);

  constructor(
    @Inject(USER_WRITE_REPOSITORY_TOKEN)
    private readonly userWriteRepository: UserWriteRepository,
  ) {}

  async execute(username: string): Promise<void> {
    this.logger.log(
      `Asserting user username is unique by username: ${username}`,
    );

    // 01: Find the user by id
    const existingUser =
      await this.userWriteRepository.findByUserName(username);

    // 02: If the user does not exist, throw an error
    if (existingUser) {
      this.logger.error(`Username ${username} is already taken`);
      throw new UserUsernameIsNotUniqueException(username);
    }
  }
}
