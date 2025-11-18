import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { UserNotFoundException } from '@/user-context/users/application/exceptions/user-not-found/user-not-found.exception';
import {
  USER_READ_REPOSITORY_TOKEN,
  UserReadRepository,
} from '@/user-context/users/domain/repositories/user-read.repository';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertUserViewModelExsistsService
  implements IBaseService<string, UserViewModel>
{
  private readonly logger = new Logger(AssertUserViewModelExsistsService.name);

  constructor(
    @Inject(USER_READ_REPOSITORY_TOKEN)
    private readonly userReadRepository: UserReadRepository,
  ) {}

  async execute(id: string): Promise<UserViewModel> {
    this.logger.log(`Asserting user view model exists by id: ${id}`);

    // 01: Find the user by id
    const existingUserViewModel = await this.userReadRepository.findById(id);

    // 02: If the user view model does not exist, throw an error
    if (!existingUserViewModel) {
      this.logger.error(`User view model not found by id: ${id}`);
      throw new UserNotFoundException(id);
    }

    return existingUserViewModel;
  }
}
