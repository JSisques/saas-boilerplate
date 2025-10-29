import { UserDeletedEvent } from '@/shared/domain/events/users/user-deleted/user-deleted.event';
import { UserNotFoundException } from '@/user-context/users/application/exceptions/user-not-found/user-not-found.exception';
import {
  USER_READ_REPOSITORY_TOKEN,
  UserReadRepository,
} from '@/user-context/users/domain/repositories/user-read.repository';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserDeletedEvent)
export class UserDeletedEventHandler
  implements IEventHandler<UserDeletedEvent>
{
  private readonly logger = new Logger(UserDeletedEventHandler.name);

  constructor(
    @Inject(USER_READ_REPOSITORY_TOKEN)
    private readonly userReadRepository: UserReadRepository,
  ) {}

  /**
   * Handles the UserDeletedEvent event by deleting the existing user view model.
   *
   * @param event - The UserDeletedEvent event to handle.
   */
  async handle(event: UserDeletedEvent) {
    this.logger.log(`Handling user deleted event: ${event.aggregateId}`);

    // 01: Find the existing user view model by id
    const existingUserViewModel: UserViewModel | null =
      await this.userReadRepository.findById(event.aggregateId);

    // 02: If the user does not exist, throw an error
    if (!existingUserViewModel) {
      this.logger.error(`User not found by id: ${event.aggregateId}`);
      throw new UserNotFoundException(event.aggregateId);
    }

    // 03: Delete the user view model
    await this.userReadRepository.delete(existingUserViewModel.id);
  }
}
