import { UserNotFoundException } from '@/features/users/application/exceptions/user-not-found/user-not-found.exception';
import {
  USER_READ_REPOSITORY_TOKEN,
  UserReadRepository,
} from '@/features/users/domain/repositories/user-read.repository';
import { UserDeletedEvent } from '@/shared/domain/events/users/user-deleted/user-deleted.event';
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

  async handle(event: UserDeletedEvent) {
    this.logger.log(`Handling user deleted event: ${event.aggregateId}`);

    // 01: Find the user by id
    const existingUser = await this.userReadRepository.findById(
      event.aggregateId,
    );

    // 02: If the user does not exist, throw an error
    if (!existingUser) {
      this.logger.error(`User not found by id: ${event.aggregateId}`);
      throw new UserNotFoundException(event.aggregateId);
    }

    // 03: Delete the user view model
    await this.userReadRepository.delete(existingUser.id);
  }
}
